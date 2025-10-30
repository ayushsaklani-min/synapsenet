#![cfg_attr(target_arch = "wasm32", no_main)]

mod state;

use linera_sdk::{
    abi::WithContractAbi,
    views::{RootView, View},
    Contract, ContractRuntime,
};

use dashboard::{AggregatedData, Event, Message, Operation};
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
    type Message = Message;
    type Parameters = ();
    type InstantiationArgument = ();
    type EventValue = Event;

    async fn load(runtime: ContractRuntime<Self>) -> Self {
        let state = DashboardState::load(runtime.root_view_storage_context())
            .await
            .expect("Failed to load state");
        DashboardContract { state, runtime }
    }

    async fn instantiate(&mut self, _argument: Self::InstantiationArgument) {
        self.runtime.application_parameters();
    }

    async fn execute_operation(&mut self, operation: Self::Operation) -> Self::Response {
        match operation {
            Operation::Subscribe => {
                // Subscription logic handled by service layer
            }
        }
    }

    async fn execute_message(&mut self, message: Self::Message) {
        let timestamp = self.runtime.system_time().micros();
        
        match message {
            Message::PriceUpdate { token: _, price } => {
                let count = *self.state.price_update_count.get();
                self.state.price_update_count.set(count + 1);
                self.state.last_price.set(price);
                self.state.last_update.set(timestamp);
                
                self.emit_aggregated_data(timestamp).await;
            }
            
            Message::ScoreUpdate { user_id: _, score } => {
                let count = *self.state.score_update_count.get();
                self.state.score_update_count.set(count + 1);
                
                let total = *self.state.total_score.get();
                self.state.total_score.set(total + score);
                
                let score_count = *self.state.score_count.get();
                self.state.score_count.set(score_count + 1);
                
                self.state.last_update.set(timestamp);
                
                self.emit_aggregated_data(timestamp).await;
            }
        }
    }

    async fn store(mut self) {
        self.state.save().await.expect("Failed to save state");
    }
}

impl DashboardContract {
    async fn emit_aggregated_data(&mut self, timestamp: u64) {
        let score_count = *self.state.score_count.get();
        let avg_score = if score_count > 0 {
            *self.state.total_score.get() / score_count as f64
        } else {
            0.0
        };
        
        let data = AggregatedData {
            price_updates: *self.state.price_update_count.get(),
            score_updates: *self.state.score_update_count.get(),
            last_price: *self.state.last_price.get(),
            avg_score,
            timestamp,
        };
        
        // self.runtime.emit(Event::DataAggregated(data));
    }
}
