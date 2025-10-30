#![cfg_attr(target_arch = "wasm32", no_main)]

mod state;

use async_graphql::{EmptySubscription, Object, Schema};
use linera_sdk::{
    abi::WithServiceAbi,
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

    async fn new(runtime: ServiceRuntime<Self>) -> Self {
        let state = DashboardState::default();
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
        let avg_score = if self.state.score_count > 0 {
            self.state.total_score / self.state.score_count as f64
        } else {
            0.0
        };
        
        AggregatedData {
            price_updates: self.state.price_update_count,
            score_updates: self.state.score_update_count,
            last_price: self.state.last_price,
            avg_score,
            timestamp: self.state.last_update,
        }
    }

    async fn price_update_count(&self) -> u64 {
        self.state.price_update_count
    }

    async fn score_update_count(&self) -> u64 {
        self.state.score_update_count
    }
}

struct MutationRoot;

#[Object]
impl MutationRoot {
    async fn placeholder(&self) -> bool {
        true
    }
}
