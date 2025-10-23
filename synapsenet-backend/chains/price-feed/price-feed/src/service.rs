#![cfg_attr(target_arch = "wasm32", no_main)]

mod state;

use self::state::PriceFeedState;
use async_graphql::{EmptySubscription, Object, Schema};
use linera_sdk::{
    base::WithServiceAbi,
    views::View,
    Service, ServiceRuntime,
};
use std::sync::Arc;
use price_feed::PriceFeedAbi;

pub struct PriceFeedService {
    state: PriceFeedState,
    runtime: ServiceRuntime<Self>,
}

linera_sdk::service!(PriceFeedService);

impl WithServiceAbi for PriceFeedService {
    type Abi = PriceFeedAbi;
}

impl Service for PriceFeedService {
    type Parameters = ();

    async fn load(runtime: ServiceRuntime<Self>) -> Self {
        let state = PriceFeedState::load(runtime.root_view_storage_context())
            .await
            .expect("Failed to load state");
        PriceFeedService { state, runtime }
    }

    async fn graphql_query(&mut self, request: Self::Query) -> Self::QueryResponse {
        let schema = Schema::build(
            QueryRoot {
                prices: self.state.prices.get().clone(),
                last_update: *self.state.last_update.get(),
                chain_id: *self.state.chain_id.get(),
            },
            price_feed::Operation::mutation_root(),
            EmptySubscription,
        )
        .finish();
        schema.execute(request).await
    }

    async fn graphql_subscription(&mut self, _request: Self::Query) -> Self::QueryResponse {
        // This is not supported in this example.
        unimplemented!("GraphQL subscriptions are not supported by the PriceFeed application")
    }
}

pub struct QueryRoot {
    prices: Vec<(String, f64)>,
    last_update: u64,
    chain_id: linera_base::data_types::ChainId,
}

#[Object]
impl QueryRoot {
    async fn prices(&self) -> &Vec<(String, f64)> {
        &self.prices
    }

    async fn last_update(&self) -> u64 {
        self.last_update
    }

    async fn chain_id(&self) -> &linera_base::data_types::ChainId {
        &self.chain_id
    }
}
