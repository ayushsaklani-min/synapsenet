use async_graphql::{Request, Response, SimpleObject};
use linera_sdk::{
    graphql::GraphQLMutationRoot,
    base::{ContractAbi, ServiceAbi},
};
use serde::{Deserialize, Serialize};

pub struct PriceFeedAbi;

impl ContractAbi for PriceFeedAbi {
    type Operation = Operation;
    type Response = ();
}

impl ServiceAbi for PriceFeedAbi {
    type Query = Request;
    type QueryResponse = Response;
}

#[derive(Debug, Clone, Deserialize, Serialize, GraphQLMutationRoot)]
pub enum Operation {
    UpdatePrice { 
        token: String, 
        price: f64,
        source: String,
        network: String,
    },
}

#[derive(Debug, Clone, Deserialize, Serialize, SimpleObject)]
pub struct PriceData {
    pub token: String,
    pub price: f64,
    pub timestamp: u64,
    pub source: String,
    pub network: String,
}

#[derive(Debug, Clone, Deserialize, Serialize)]
pub enum Message {
    PriceUpdate(PriceData),
}

#[derive(Debug, Clone, Deserialize, Serialize)]
pub enum Event {
    PriceUpdated(PriceData),
}
