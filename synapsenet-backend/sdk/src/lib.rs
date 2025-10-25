use async_trait::async_trait;
use linera_sdk::{
    base::{Amount, ApplicationId, ChainId, Owner},
    client::ChainClient,
    graphql::GraphQLClient,
    views::View,
};
use serde::{Deserialize, Serialize};
use serde_json::Value;
use std::{collections::HashMap, sync::Arc};
use tokio::sync::Mutex;
use uuid::Uuid;
use std::str::FromStr;
use std::env;

pub mod error;
pub mod events;
pub mod types;
pub mod client;

use error::SynapseNetError;
use events::{Event, EventType};
use types::{ChainConfig, SynapseNetConfig};
use client::SynapseNetClient;

pub struct SynapseNet {
    client: Arc<Mutex<SynapseNetClient>>,
    config: SynapseNetConfig,
    subscriptions: Arc<Mutex<HashMap<EventType, Vec<Box<dyn Fn(Event) + Send>>>>>,
}

impl SynapseNet {
    pub fn new() -> Self {
        let config = SynapseNetConfig::from_env().expect("Failed to build SynapseNet configuration");

        let client = Arc::new(Mutex::new(SynapseNetClient::new(config.clone())));
        let subscriptions = Arc::new(Mutex::new(HashMap::new()));

        SynapseNet {
            client,
            config,
            subscriptions,
        }
    }

    pub async fn publish(&self, event_type: EventType, payload: Value) -> Result<(), SynapseNetError> {
        let client = self.client.lock().await;
        client.publish_event(event_type, payload).await
    }

    pub async fn subscribe<F>(&self, event_type: EventType, callback: F) -> Result<(), SynapseNetError>
    where
        F: Fn(Event) + Send + 'static,
    {
        let mut subscriptions = self.subscriptions.lock().await;
        subscriptions.entry(event_type).or_default().push(Box::new(callback));
        Ok(())
    }

    pub async fn start_event_listener(&self) -> Result<(), SynapseNetError> {
        let client = self.client.clone();
        let subscriptions = self.subscriptions.clone();

        tokio::spawn(async move {
            let mut client_locked = client.lock().await;
            client_locked.listen_for_events(subscriptions).await;
        });
        Ok(())
    }
}
