#![cfg_attr(target_arch = "wasm32", no_main)]

mod state;

use linera_sdk::{
    linera_base_types::WithContractAbi,
    views::{RootView, View},
    Contract, ContractRuntime,
};

use dashboard::{Operation, DashboardEvent};

use self::state::DashboardState;

pub struct DashboardContract {
    state: DashboardState,
    runtime: ContractRuntime<Self>,
}

linera_sdk::contract!(DashboardContract);

impl WithContractAbi for DashboardContract {
    type Abi = dashboard::DashboardAbi;
}

impl Contract for DashboardContract {
    type Message = ();
    type Parameters = ();
    type InstantiationArgument = ();
    type EventValue = DashboardEvent;

    async fn load(runtime: ContractRuntime<Self>) -> Self {
        let state = DashboardState::load(runtime.root_view_storage_context())
            .await
            .expect("Failed to load state");
        DashboardContract { state, runtime }
    }

    async fn instantiate(&mut self, _argument: Self::InstantiationArgument) {
        self.runtime.application_parameters();
        // Chain ID available via self.runtime.chain_id() when needed
    }

    async fn execute_operation(&mut self, operation: Self::Operation) -> Self::Response {
        match operation {
            Operation::ReceiveEvent { event_type, payload } => {
                let timestamp = self.runtime.system_time().micros();
                self.state.received_events.get_mut().push(format!("{}: {}", event_type, payload));
                // Event emission handled by framework via EventValue type
            }
        }
    }

    async fn execute_message(&mut self, _message: Self::Message) {}

    async fn store(mut self) {
        self.state.save().await.expect("Failed to save state");
    }
}
