use async_graphql::{Request, Response};
use linera_sdk::{
    graphql::GraphQLMutationRoot,
    linera_base_types::{ContractAbi, ServiceAbi},
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

#[derive(Debug, Deserialize, Serialize, GraphQLMutationRoot)]
pub enum Operation {
    UpdatePrice { token: String, price: f64 },
}

#[derive(Debug, Deserialize, Serialize)]
pub enum PriceFeedEvent {
    PriceUpdate { token: String, price: f64, timestamp: u64 },
}
