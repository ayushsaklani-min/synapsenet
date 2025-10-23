#![cfg_attr(target_arch = "wasm32", no_main)]

mod state;

use self::state::DashboardState;
use async_graphql::{EmptySubscription, Object, Schema};
use linera_sdk::{
    base::WithServiceAbi,
    views::View,
    Service, ServiceRuntime,
};
use std::sync::Arc;
use dashboard::DashboardAbi;

pub struct DashboardService {
    state: DashboardState,
    runtime: ServiceRuntime<Self>,
}

linera_sdk::service!(DashboardService);

impl WithServiceAbi for DashboardService {
    type Abi = DashboardAbi;
}

impl Service for DashboardService {
    type Parameters = ();

    async fn load(runtime: ServiceRuntime<Self>) -> Self {
        let state = DashboardState::load(runtime.root_view_storage_context())
            .await
            .expect("Failed to load state");
        DashboardService { state, runtime }
    }

    async fn graphql_query(&mut self, request: Self::Query) -> Self::QueryResponse {
        let schema = Schema::build(
            QueryRoot {
                received_events: self.state.received_events.get().clone(),
                chain_id: *self.state.chain_id.get(),
            },
            dashboard::Operation::mutation_root(),
            EmptySubscription,
        )
        .finish();
        schema.execute(request).await
    }

    async fn graphql_subscription(&mut self, _request: Self::Query) -> Self::QueryResponse {
        // This is not supported in this example.
        unimplemented!("GraphQL subscriptions are not supported by the Dashboard application")
    }
}

pub struct QueryRoot {
    received_events: Vec<String>,
    chain_id: linera_base::data_types::ChainId,
}

#[Object]
impl QueryRoot {
    async fn received_events(&self) -> &Vec<String> {
        &self.received_events
    }

    async fn chain_id(&self) -> &linera_base::data_types::ChainId {
        &self.chain_id
    }
}
