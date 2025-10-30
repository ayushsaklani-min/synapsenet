#![cfg_attr(target_arch = "wasm32", no_main)]

mod state;

use async_graphql::{EmptySubscription, Object, Schema};
use linera_sdk::{
    abi::WithServiceAbi,
    views::{View, ViewStorageContext},
    Service, ServiceRuntime,
};
use identity_score::ScoreData;
use self::state::IdentityScoreState;
use std::sync::Arc;

pub struct IdentityScoreService {
    state: Arc<IdentityScoreState>,
}

linera_sdk::service!(IdentityScoreService);

impl WithServiceAbi for IdentityScoreService {
    type Abi = identity_score::IdentityScoreAbi;
}

impl Service for IdentityScoreService {
    type Parameters = ();

    async fn new(runtime: ServiceRuntime<Self>) -> Self {
        let state = IdentityScoreState::default();
        IdentityScoreService {
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
    state: Arc<IdentityScoreState>,
}

#[Object]
impl QueryRoot {
    async fn score(&self, user_id: String) -> Option<ScoreData> {
        self.state.scores.get(&user_id).cloned()
    }

    async fn all_scores(&self) -> Vec<ScoreData> {
        self.state.scores.values().cloned().collect()
    }

    async fn transaction_count(&self, user_id: String) -> u64 {
        self.state.transaction_counts.get(&user_id).cloned().unwrap_or(0)
    }

    async fn success_rate(&self, user_id: String) -> f64 {
        let tx_count = self.state.transaction_counts.get(&user_id).cloned().unwrap_or(0);
        let success_count = self.state.success_counts.get(&user_id).cloned().unwrap_or(0);
        
        if tx_count > 0 {
            (success_count as f64 / tx_count as f64) * 100.0
        } else {
            0.0
        }
    }
}

struct MutationRoot;

#[Object]
impl MutationRoot {
    async fn placeholder(&self) -> bool {
        true
    }
}
