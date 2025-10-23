#![cfg_attr(target_arch = "wasm32", no_main)]

mod state;

use self::state::IdentityScoreState;
use async_graphql::{EmptySubscription, Object, Schema};
use linera_sdk::{
    base::WithServiceAbi,
    views::View,
    Service, ServiceRuntime,
};
use std::sync::Arc;
use identity_score::IdentityScoreAbi;

pub struct IdentityScoreService {
    state: IdentityScoreState,
    runtime: ServiceRuntime<Self>,
}

linera_sdk::service!(IdentityScoreService);

impl WithServiceAbi for IdentityScoreService {
    type Abi = IdentityScoreAbi;
}

impl Service for IdentityScoreService {
    type Parameters = ();

    async fn load(runtime: ServiceRuntime<Self>) -> Self {
        let state = IdentityScoreState::load(runtime.root_view_storage_context())
            .await
            .expect("Failed to load state");
        IdentityScoreService { state, runtime }
    }

    async fn graphql_query(&mut self, request: Self::Query) -> Self::QueryResponse {
        let schema = Schema::build(
            QueryRoot {
                scores: self.state.scores.get().clone(),
                last_update: *self.state.last_update.get(),
                chain_id: *self.state.chain_id.get(),
            },
            identity_score::Operation::mutation_root(),
            EmptySubscription,
        )
        .finish();
        schema.execute(request).await
    }

    async fn graphql_subscription(&mut self, _request: Self::Query) -> Self::QueryResponse {
        // This is not supported in this example.
        unimplemented!("GraphQL subscriptions are not supported by the IdentityScore application")
    }
}

pub struct QueryRoot {
    scores: std::collections::HashMap<String, f64>,
    last_update: u64,
    chain_id: linera_base::data_types::ChainId,
}

#[Object]
impl QueryRoot {
    async fn scores(&self) -> &std::collections::HashMap<String, f64> {
        &self.scores
    }

    async fn last_update(&self) -> u64 {
        self.last_update
    }

    async fn chain_id(&self) -> &linera_base::data_types::ChainId {
        &self.chain_id
    }
}
