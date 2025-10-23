use async_graphql::{Request, Response};
use linera_sdk::{
    graphql::GraphQLMutationRoot,
    linera_base_types::{ContractAbi, ServiceAbi},
};
use serde::{Deserialize, Serialize};

pub struct IdentityScoreAbi;

impl ContractAbi for IdentityScoreAbi {
    type Operation = Operation;
    type Response = ();
    type Event = IdentityScoreEvent;
}

impl ServiceAbi for IdentityScoreAbi {
    type Query = Request;
    type QueryResponse = Response;
}

#[derive(Debug, Deserialize, Serialize, GraphQLMutationRoot)]
pub enum Operation {
    UpdateScore { user_id: String, score: f64, reason: String },
}

#[derive(Debug, Deserialize, Serialize)]
pub enum IdentityScoreEvent {
    ScoreUpdate { user_id: String, score: f64, reason: String, timestamp: u64 },
}
