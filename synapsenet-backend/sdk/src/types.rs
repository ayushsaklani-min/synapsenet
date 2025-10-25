use linera_sdk::base::{ApplicationId, ChainId};
use serde::{Deserialize, Serialize};
use std::str::FromStr;

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
    pub graphql_endpoint: String,
    pub wallet_path: String,
    pub keystore_path: String,
    pub storage_path: String,
}

impl SynapseNetConfig {
    pub fn from_env() -> Result<Self, anyhow::Error> {
        const DEFAULT_CHAIN_ID: &str = "617b38dd13174e227eec44357524c7c692361ce134e60de753485d2f692f6d56";
        const DEFAULT_PRICE_FEED_APP_ID: &str = "6694d606dbbcc922ac825fb846d3ea84cb62587cda95ba3bcac9af40c3cae920";
        const DEFAULT_IDENTITY_SCORE_APP_ID: &str = "3966161f27823fe841186b7d00534d05551ee8b55759d877a758c527620aa5f6";
        const DEFAULT_DASHBOARD_APP_ID: &str = "0fa26c20ef1eb8d10043255bd92e03c5396ff478d3f188644530bce5368741ad";

        const DEFAULT_CHAIN_ID: &str = "617b38dd13174e227eec44357524c7c692361ce134e60de753485d2f692f6d56";
        const DEFAULT_PRICE_FEED_APP_ID: &str = "6694d606dbbcc922ac825fb846d3ea84cb62587cda95ba3bcac9af40c3cae920";
        const DEFAULT_IDENTITY_SCORE_APP_ID: &str = "3966161f27823fe841186b7d00534d05551ee8b55759d877a758c527620aa5f6";
        const DEFAULT_DASHBOARD_APP_ID: &str = "0fa26c20ef1eb8d10043255bd92e03c5396ff478d3f188644530bce5368741ad";

        let parse_chain = |env_key: &str| -> Result<ChainId, anyhow::Error> {
            let value = std::env::var(env_key).unwrap_or_else(|_| DEFAULT_CHAIN_ID.to_string());
            ChainId::from_str(&value).map_err(|e| anyhow::anyhow!("Invalid chain id {env_key}: {e}"))
        };

        let parse_app = |env_key: &str, default: &str| -> Result<ApplicationId, anyhow::Error> {
            let value = std::env::var(env_key).unwrap_or_else(|_| default.to_string());
            ApplicationId::from_str(&value).map_err(|e| anyhow::anyhow!("Invalid application id {env_key}: {e}"))
        };

        let price_feed_chain = ChainConfig {
            chain_id: parse_chain("LINERA_PRICE_FEED_CHAIN_ID")?,
            application_id: parse_app("LINERA_PRICE_FEED_APP_ID", DEFAULT_PRICE_FEED_APP_ID)?,
        };

        let identity_score_chain = ChainConfig {
            chain_id: parse_chain("LINERA_IDENTITY_SCORE_CHAIN_ID")?,
            application_id: parse_app("LINERA_IDENTITY_SCORE_APP_ID", DEFAULT_IDENTITY_SCORE_APP_ID)?,
        };

        let dashboard_chain = ChainConfig {
            chain_id: parse_chain("LINERA_DASHBOARD_CHAIN_ID")?,
            application_id: parse_app("LINERA_DASHBOARD_APP_ID", DEFAULT_DASHBOARD_APP_ID)?,
        };

        let graphql_endpoint = std::env::var("LINERA_GRAPHQL_ENDPOINT")
            .unwrap_or_else(|_| "http://localhost:8080/graphql".to_string());
        let wallet_path = std::env::var("LINERA_WALLET_PATH")
            .unwrap_or_else(|_| "/tmp/linera-net/wallet_0.json".to_string());
        let keystore_path = std::env::var("LINERA_KEYSTORE_PATH")
            .unwrap_or_else(|_| "/tmp/linera-net/keystore_0.json".to_string());
        let storage_path = std::env::var("LINERA_STORAGE_PATH")
            .unwrap_or_else(|_| "rocksdb:/tmp/linera-net/client_0.db".to_string());

        Ok(SynapseNetConfig {
            price_feed_chain,
            identity_score_chain,
            dashboard_chain,
            graphql_endpoint,
            wallet_path,
            keystore_path,
            storage_path,
        })
    }
}
