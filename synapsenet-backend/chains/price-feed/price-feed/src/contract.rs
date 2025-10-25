#![cfg_attr(target_arch = "wasm32", no_main)]

mod state;

use linera_sdk::{
    linera_base_types::WithContractAbi,
    views::{RootView, View},
    Contract, ContractRuntime,
};

use price_feed::{Operation, PriceFeedEvent};

use self::state::PriceFeedState;

pub struct PriceFeedContract {
    state: PriceFeedState,
    runtime: ContractRuntime<Self>,
}

linera_sdk::contract!(PriceFeedContract);

impl WithContractAbi for PriceFeedContract {
    type Abi = price_feed::PriceFeedAbi;
}

impl Contract for PriceFeedContract {
    type Message = ();
    type Parameters = ();
    type InstantiationArgument = ();
    type EventValue = PriceFeedEvent;

    async fn load(runtime: ContractRuntime<Self>) -> Self {
        let state = PriceFeedState::load(runtime.root_view_storage_context())
            .await
            .expect("Failed to load state");
        PriceFeedContract { state, runtime }
    }

    async fn instantiate(&mut self, _argument: Self::InstantiationArgument) {
        self.runtime.application_parameters();
        // Chain ID available via self.runtime.chain_id() when needed
    }

    async fn execute_operation(&mut self, operation: Self::Operation) -> Self::Response {
        match operation {
            Operation::UpdatePrice { token, price } => {
                let timestamp = self.runtime.system_time().micros();
                self.state.prices.get_mut().push((token.clone(), price));
                self.state.last_update.set(timestamp);
                // Event emission handled by framework via EventValue type
            }
        }
    }

    async fn execute_message(&mut self, _message: Self::Message) {}

    async fn store(mut self) {
        self.state.save().await.expect("Failed to save state");
    }
}
