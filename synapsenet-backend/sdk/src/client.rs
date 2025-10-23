use linera_sdk::{
    base::{ApplicationId, ChainId},
    client::ChainClient,
    graphql::GraphQLClient,
};
use serde_json::Value;
use std::{collections::HashMap, sync::Arc};
use tokio::sync::Mutex;
use futures_util::StreamExt;

use crate::{
    error::SynapseNetError,
    events::{Event, EventType},
    types::SynapseNetConfig,
};

pub struct SynapseNetClient {
    config: SynapseNetConfig,
    client: ChainClient,
}

impl SynapseNetClient {
    pub fn new(config: SynapseNetConfig) -> Self {
        let client = ChainClient::new(
            "http://localhost:8080/graphql".to_string(), // Linera GraphQL endpoint
            None, // No wallet path needed for this example
            None, // No keystore path needed for this example
            None, // No storage path needed for this example
        )
        .expect("Failed to create Linera client");

        SynapseNetClient { config, client }
    }

    pub async fn publish_event(&self, event_type: EventType, payload: Value) -> Result<(), SynapseNetError> {
        let (chain_id, application_id) = match event_type {
            EventType::PriceUpdate => (self.config.price_feed_chain.chain_id, self.config.price_feed_chain.application_id),
            EventType::ScoreUpdate => (self.config.identity_score_chain.chain_id, self.config.identity_score_chain.application_id),
        };

        let operation = match event_type {
            EventType::PriceUpdate => format!(
                "mutation {{ updatePrice(token: \"{}\", price: {}) }}",
                payload["token"].as_str().unwrap_or_default(),
                payload["price"].as_f64().unwrap_or_default()
            ),
            EventType::ScoreUpdate => format!(
                "mutation {{ updateScore(userId: \"{}\", score: {}, reason: \"{}\") }}",
                payload["user_id"].as_str().unwrap_or_default(),
                payload["score"].as_f64().unwrap_or_default(),
                payload["reason"].as_str().unwrap_or_default()
            ),
        };

        self.client
            .query_application(chain_id, application_id, operation)
            .await
            .map_err(|e| SynapseNetError::LineraClientError(e))?;

        Ok(())
    }

    pub async fn listen_for_events(&mut self, subscriptions: Arc<Mutex<HashMap<EventType, Vec<Box<dyn Fn(Event) + Send>>>>>) {
        println!("🔗 Connecting to real-time blockchain data...");
        
        // Connect to WebSocket server for real Chainlink data
        let ws_url = "ws://localhost:8081";
        
        loop {
            match tokio_tungstenite::connect_async(ws_url).await {
                Ok((ws_stream, _)) => {
                    println!("✅ Connected to real-time data stream");
                    let (_write, read) = ws_stream.split();
                    
                    // Handle incoming messages
                    let read_future = read.for_each(|message| async {
                        if let Ok(msg) = message {
                            if let Ok(text) = msg.to_text() {
                                if let Ok(data) = serde_json::from_str::<serde_json::Value>(text) {
                                    if let Some(event_type) = data.get("type").and_then(|t| t.as_str()) {
                                        if event_type == "price_update" {
                                            // Publish to Linera microchain and notify subscribers
                                            if let Some(payload) = data.get("data") {
                                                let mut payload_owned = payload.clone();
                                                // Forward to application by calling publish_event
                                                // Note: We ignore errors here to keep stream flowing
                                                let _ = self.client
                                                    .query_application(
                                                        self.config.price_feed_chain.chain_id,
                                                        self.config.price_feed_chain.application_id,
                                                        format!(
                                                            "mutation {{ updatePrice(token: \"{}\", price: {}) }}",
                                                            payload_owned["token"].as_str().unwrap_or("ETH"),
                                                            payload_owned["price"].as_f64().unwrap_or(0.0)
                                                        ),
                                                    )
                                                    .await;
                                            }

                                            let event = Event {
                                                id: data.get("id").and_then(|v| v.as_str()).unwrap_or("").to_string(),
                                                event_type: EventType::PriceUpdate,
                                                payload: data.get("data").cloned().unwrap_or(serde_json::Value::Null),
                                                timestamp: data.get("timestamp").and_then(|v| v.as_u64()).unwrap_or(0),
                                                source_chain: data.get("sourceChain").and_then(|v| v.as_str()).unwrap_or("").to_string(),
                                            };
                                            if let Ok(subs) = subscriptions.lock().await.get(&EventType::PriceUpdate) {
                                                for callback in subs {
                                                    callback(event.clone());
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    });
                    
                    read_future.await;
                }
                Err(e) => {
                    println!("❌ WebSocket connection failed: {}. Retrying in 5 seconds...", e);
                    tokio::time::sleep(std::time::Duration::from_secs(5)).await;
                }
            }
        }
    }
}
