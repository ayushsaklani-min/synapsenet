use thiserror::Error;

#[derive(Debug, Error)]
pub enum SynapseNetError {
    #[error("Linera client error: {0}")]
    LineraClientError(#[from] linera_sdk::client::ChainClientError),
    #[error("GraphQL error: {0}")]
    GraphQLError(String),
    #[error("Serialization error: {0}")]
    SerializationError(#[from] serde_json::Error),
    #[error("HTTP error: {0}")]
    HttpError(#[from] reqwest::Error),
    #[error("Invalid event type: {0}")]
    InvalidEventType(String),
    #[error("Other error: {0}")]
    Other(String),
}
