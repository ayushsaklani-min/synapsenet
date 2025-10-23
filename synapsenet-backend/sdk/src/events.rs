use serde::{Deserialize, Serialize};
use serde_json::Value;
use uuid::Uuid;

#[derive(Debug, Clone, PartialEq, Eq, Hash, Serialize, Deserialize)]
pub enum EventType {
    PriceUpdate,
    ScoreUpdate,
    // Add other event types as needed
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Event {
    pub id: String,
    pub event_type: EventType,
    pub payload: Value,
    pub timestamp: u64,
    pub source_chain: String,
}

impl Event {
    pub fn new(event_type: EventType, payload: Value, source_chain: String) -> Self {
        Event {
            id: Uuid::new_v4().to_string(),
            event_type,
            payload,
            timestamp: chrono::Utc::now().timestamp_millis() as u64,
            source_chain,
        }
    }
}
