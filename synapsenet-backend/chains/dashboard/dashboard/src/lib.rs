use async_graphql::{Request, Response};
use linera_sdk::{
    graphql::GraphQLMutationRoot,
    linera_base_types::{ContractAbi, ServiceAbi},
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

#[derive(Debug, Deserialize, Serialize, GraphQLMutationRoot)]
pub enum Operation {
    ReceiveEvent { event_type: String, payload: String },
}

#[derive(Debug, Deserialize, Serialize)]
pub enum DashboardEvent {
    EventReceived { event_type: String, payload: String, timestamp: u64 },
}
