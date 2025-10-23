use synapsenet_sdk::{SynapseNet, EventType};
use serde_json::json;
use std::time::Duration;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    println!("🚀 Starting SynapseNet Demo...");

    // Initialize SynapseNet
    let synapsenet = SynapseNet::new();

    // Subscribe to price updates
    let _price_subscription = synapsenet.subscribe(EventType::PriceUpdate, |event| {
        println!("💰 Price Update: Token: {}, Price: ${:.2}",
            event.payload["token"].as_str().unwrap_or("Unknown"),
            event.payload["price"].as_f64().unwrap_or(0.0)
        );
    }).await?;

    // Subscribe to score updates
    let _score_subscription = synapsenet.subscribe(EventType::ScoreUpdate, |event| {
        println!("👤 Score Update: User: {}, Score: {:.1}",
            event.payload["user_id"].as_str().unwrap_or("Unknown"),
            event.payload["score"].as_f64().unwrap_or(0.0)
        );
    }).await?;

    println!("📡 Subscriptions active. Listening for real blockchain events...\n");
    println!("🔗 Connecting to Chainlink Oracle on Polygon Amoy...");
    println!("💰 Monitoring ETH/USD price feed...");

    // Start listening for real blockchain events
    synapsenet.start_event_listener().await?;

    // Keep the program running to receive real-time data
    println!("⏳ Waiting for real blockchain data...");
    println!("🌐 Frontend should be running at: http://localhost:5173");
    println!("🔗 Chainlink Oracle: Polygon Amoy Testnet");
    
    // Prevent exit; keep process alive
    futures_util::future::pending::<()>().await;

    println!("\n✅ SynapseNet Demo completed successfully!");
    println!("🌐 Frontend should be running at: http://localhost:5173");
    println!("🔗 Linera GraphQL endpoint: http://localhost:8080/graphql");

    Ok(())
}
