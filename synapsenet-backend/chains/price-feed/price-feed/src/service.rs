#![cfg_attr(target_arch = "wasm32", no_main)]

mod state;

use async_graphql::{EmptySubscription, Object, Schema, SimpleObject};
use linera_sdk::{
    base::WithServiceAbi,
    views::{View, ViewStorageContext},
    Service, ServiceRuntime,
};
use price_feed::PriceData;
use self::state::PriceFeedState;
use std::sync::Arc;

pub struct PriceFeedService {
    state: Arc<PriceFeedState>,
}

linera_sdk::service!(PriceFeedService);

impl WithServiceAbi for PriceFeedService {
    type Abi = price_feed::PriceFeedAbi;
}

impl Service for PriceFeedService {
    type Parameters = ();

    async fn load(runtime: ServiceRuntime<Self>) -> Self {
        let state = PriceFeedState::load(ViewStorageContext::from(runtime.root_view_storage_context()))
            .await
            .expect("Failed to load state");
        PriceFeedService {
            state: Arc::new(state),
        }
    }

    async fn handle_query(&self, request: Self::Query) -> Self::QueryResponse {
        let schema = Schema::build(
            QueryRoot {
                state: self.state.clone(),
            },
            MutationRoot,
            EmptySubscription,
        )
        .finish();
        schema.execute(request).await
    }
}

struct QueryRoot {
    state: Arc<PriceFeedState>,
}

#[Object]
impl QueryRoot {
    async fn price(&self, token: String) -> Option<PriceData> {
        self.state.prices.get(&token).await.ok().flatten()
    }

    async fn all_prices(&self) -> Vec<PriceData> {
        let mut prices = Vec::new();
        self.state.prices.for_each_index_value(|_key, value| {
            prices.push(value.clone());
            Ok(())
        }).await.ok();
        prices
    }

    async fn last_update(&self) -> u64 {
        self.state.last_update.get().copied().unwrap_or(0)
    }

    async fn update_count(&self) -> u64 {
        self.state.update_count.get().copied().unwrap_or(0)
    }
}

struct MutationRoot;

#[Object]
impl MutationRoot {
    async fn placeholder(&self) -> bool {
        true
    }
}
