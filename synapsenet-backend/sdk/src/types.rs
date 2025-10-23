use linera_sdk::base::{ApplicationId, ChainId};
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ChainConfig {
    pub chain_id: ChainId,
    pub application_id: ApplicationId,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SynapseNetConfig {
    pub price_feed_chain: ChainConfig,
    pub identity_score_chain: ChainConfig,
    pub dashboard_chain: ChainConfig,
}
