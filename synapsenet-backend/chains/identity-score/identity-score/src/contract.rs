#![cfg_attr(target_arch = "wasm32", no_main)]

mod state;

use linera_sdk::{
    linera_base_types::WithContractAbi,
    views::{RootView, View},
    Contract, ContractRuntime,
};

use identity_score::{Operation, IdentityScoreEvent};

use self::state::IdentityScoreState;

pub struct IdentityScoreContract {
    state: IdentityScoreState,
    runtime: ContractRuntime<Self>,
}

linera_sdk::contract!(IdentityScoreContract);

impl WithContractAbi for IdentityScoreContract {
    type Abi = identity_score::IdentityScoreAbi;
}

impl Contract for IdentityScoreContract {
    type Message = ();
    type Parameters = ();
    type InstantiationArgument = ();
    type EventValue = IdentityScoreEvent;

    async fn load(runtime: ContractRuntime<Self>) -> Self {
        let state = IdentityScoreState::load(runtime.root_view_storage_context())
            .await
            .expect("Failed to load state");
        IdentityScoreContract { state, runtime }
    }

    async fn instantiate(&mut self, _argument: Self::InstantiationArgument) {
        self.runtime.application_parameters();
        self.state.chain_id.set(self.runtime.chain_id());
    }

    async fn execute_operation(&mut self, operation: Self::Operation) -> Self::Response {
        match operation {
            Operation::UpdateScore { user_id, score, reason } => {
                let timestamp = self.runtime.system_time().as_micros();
                self.state.scores.get_mut().insert(user_id.clone(), score);
                self.state.last_update.set(timestamp);
                self.runtime.emit_event(IdentityScoreEvent::ScoreUpdate { user_id, score, reason, timestamp });
            }
        }
    }

    async fn execute_message(&mut self, _message: Self::Message) {}

    async fn store(mut self) {
        self.state.save().await.expect("Failed to save state");
    }
}
