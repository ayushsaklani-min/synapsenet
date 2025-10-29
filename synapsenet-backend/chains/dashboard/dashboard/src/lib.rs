use async_graphql::{Request, Response, SimpleObject};
use linera_sdk::{
    graphql::GraphQLMutationRoot,
    base::{ContractAbi, ServiceAbi},
};
use serde::{Deserialize, Serialize};

pub struct DashboardAbi;

impl ContractAbi for DashboardAbi {
    type Operation = Operation;
    type Response = ();
}

impl ServiceAbi for DashboardAbi {
    type Query = Request;
    type QueryResponse = Response;
}

#[derive(Debug, Clone, Deserialize, Serialize, GraphQLMutationRoot)]
pub enum Operation {
    Subscribe,
}

#[derive(Debug, Clone, Deserialize, Serialize, SimpleObject)]
pub struct AggregatedData {
    pub price_updates: u64,
    pub score_updates: u64,
    pub last_price: f64,
    pub avg_score: f64,
    pub timestamp: u64,
}

#[derive(Debug, Clone, Deserialize, Serialize)]
pub enum Message {
    PriceUpdate { token: String, price: f64 },
    ScoreUpdate { user_id: String, score: f64 },
}

#[derive(Debug, Clone, Deserialize, Serialize)]
pub enum Event {
    DataAggregated(AggregatedData),
}
