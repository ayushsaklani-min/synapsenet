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
        let state = DashboardState::default();
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
                self.state.price_update_count += 1;
                self.state.last_price = price;
                self.state.last_update = timestamp;
                
                self.emit_aggregated_data(timestamp).await;
            }
            
            Message::ScoreUpdate { user_id: _, score } => {
                self.state.score_update_count += 1;
                self.state.total_score += score;
                self.state.score_count += 1;
                self.state.last_update = timestamp;
                
                self.emit_aggregated_data(timestamp).await;
            }
        }
    }

    async fn store(mut self) {
        // State is automatically persisted
    }
}

impl DashboardContract {
    async fn emit_aggregated_data(&mut self, timestamp: u64) {
        let avg_score = if self.state.score_count > 0 {
            self.state.total_score / self.state.score_count as f64
        } else {
            0.0
        };
        
        let data = AggregatedData {
            price_updates: self.state.price_update_count,
            score_updates: self.state.score_update_count,
            last_price: self.state.last_price,
            avg_score,
            timestamp,
        };
        
        // self.runtime.emit(Event::DataAggregated(data));
    }
}
