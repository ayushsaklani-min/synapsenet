use async_graphql::{Request, Response, SimpleObject};
use linera_sdk::{
    graphql::GraphQLMutationRoot,
    base::{ContractAbi, ServiceAbi},
};
use serde::{Deserialize, Serialize};

pub struct IdentityScoreAbi;

impl ContractAbi for IdentityScoreAbi {
    type Operation = Operation;
    type Response = ();
}

impl ServiceAbi for IdentityScoreAbi {
    type Query = Request;
    type QueryResponse = Response;
}

#[derive(Debug, Clone, Deserialize, Serialize, GraphQLMutationRoot)]
pub enum Operation {
    UpdateScore {
        user_id: String,
        score: f64,
        reason: String,
    },
    RecordTransaction {
        user_id: String,
        transaction_type: String,
        success: bool,
    },
}

#[derive(Debug, Clone, Deserialize, Serialize, SimpleObject)]
pub struct ScoreData {
    pub user_id: String,
    pub score: f64,
    pub timestamp: u64,
    pub reason: String,
    pub transaction_count: u64,
    pub success_rate: f64,
}

#[derive(Debug, Clone, Deserialize, Serialize)]
pub enum Message {
    ScoreUpdate(ScoreData),
}

#[derive(Debug, Clone, Deserialize, Serialize)]
pub enum Event {
    ScoreUpdated(ScoreData),
    TransactionRecorded {
        user_id: String,
        transaction_type: String,
        success: bool,
        new_score: f64,
    },
}
