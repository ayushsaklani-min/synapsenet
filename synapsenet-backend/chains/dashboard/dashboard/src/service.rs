#![cfg_attr(target_arch = "wasm32", no_main)]

mod state;

use async_graphql::{EmptySubscription, Object, Schema};
use linera_sdk::{
    base::WithServiceAbi,
    views::{View, ViewStorageContext},
    Service, ServiceRuntime,
};
use dashboard::AggregatedData;
use self::state::DashboardState;
use std::sync::Arc;

pub struct DashboardService {
    state: Arc<DashboardState>,
}

linera_sdk::service!(DashboardService);

impl WithServiceAbi for DashboardService {
    type Abi = dashboard::DashboardAbi;
}

impl Service for DashboardService {
    type Parameters = ();

    async fn load(runtime: ServiceRuntime<Self>) -> Self {
        let state = DashboardState::load(ViewStorageContext::from(runtime.root_view_storage_context()))
            .await
            .expect("Failed to load state");
        DashboardService {
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
    state: Arc<DashboardState>,
}

#[Object]
impl QueryRoot {
    async fn aggregated_data(&self) -> AggregatedData {
        let price_updates = self.state.price_update_count.get().copied().unwrap_or(0);
        let score_updates = self.state.score_update_count.get().copied().unwrap_or(0);
        let last_price = self.state.last_price.get().copied().unwrap_or(0.0);
        let total_score = self.state.total_score.get().copied().unwrap_or(0.0);
        let score_count = self.state.score_count.get().copied().unwrap_or(0);
        let timestamp = self.state.last_update.get().copied().unwrap_or(0);
        
        let avg_score = if score_count > 0 {
            total_score / score_count as f64
        } else {
            0.0
        };
        
        AggregatedData {
            price_updates,
            score_updates,
            last_price,
            avg_score,
            timestamp,
        }
    }

    async fn price_update_count(&self) -> u64 {
        self.state.price_update_count.get().copied().unwrap_or(0)
    }

    async fn score_update_count(&self) -> u64 {
        self.state.score_update_count.get().copied().unwrap_or(0)
    }
}

struct MutationRoot;

#[Object]
impl MutationRoot {
    async fn placeholder(&self) -> bool {
        true
    }
}
