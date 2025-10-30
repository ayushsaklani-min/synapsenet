#![cfg_attr(target_arch = "wasm32", no_main)]

mod state;

use linera_sdk::{
    abi::WithContractAbi,
    views::{RootView, View},
    Contract, ContractRuntime,
};

use price_feed::{Event, Message, Operation, PriceData};
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
    type Message = Message;
    type Parameters = ();
    type InstantiationArgument = ();
    type EventValue = Event;

    async fn load(runtime: ContractRuntime<Self>) -> Self {
        let state = PriceFeedState::load(runtime.root_view_storage_context())
            .await
            .expect("Failed to load state");
        PriceFeedContract { state, runtime }
    }

    async fn instantiate(&mut self, _argument: Self::InstantiationArgument) {
        self.runtime.application_parameters();
    }

    async fn execute_operation(&mut self, operation: Self::Operation) -> Self::Response {
        match operation {
            Operation::UpdatePrice { token, price, source, network } => {
                let timestamp = self.runtime.system_time().micros();
                
                let price_data = PriceData {
                    token: token.clone(),
                    price,
                    timestamp,
                    source,
                    network,
                };
                
                // Store price data using MapView
                self.state.prices.insert(&token, price_data.clone())
                    .expect("Failed to insert price");
                self.state.last_update.set(timestamp);
                
                // Increment counter using RegisterView
                let count = self.state.update_count.get();
                self.state.update_count.set(count + 1);
                
                // Emit event for subscribers
                // self.runtime.emit_event(Event::PriceUpdated(price_data));
            }
        }
    }

    async fn execute_message(&mut self, message: Self::Message) {
        match message {
            Message::PriceUpdate(price_data) => {
                // Handle cross-chain price updates using MapView
                self.state.prices.insert(&price_data.token, price_data.clone())
                    .expect("Failed to insert price");
                self.state.last_update.set(price_data.timestamp);
                
                // self.runtime.emit_event(Event::PriceUpdated(price_data));
            }
        }
    }

    async fn store(mut self) {
        self.state.save().await.expect("Failed to save state");
    }
}
