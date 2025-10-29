#![cfg_attr(target_arch = "wasm32", no_main)]

mod state;

use linera_sdk::{
    base::WithContractAbi,
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
                let count = self.state.price_update_count.get().copied().unwrap_or(0);
                self.state.price_update_count.set(count + 1);
                self.state.last_price.set(price);
                self.state.last_update.set(timestamp);
                
                self.emit_aggregated_data(timestamp).await;
            }
            
            Message::ScoreUpdate { user_id: _, score } => {
                let count = self.state.score_update_count.get().copied().unwrap_or(0);
                self.state.score_update_count.set(count + 1);
                
                let total = self.state.total_score.get().copied().unwrap_or(0.0);
                let score_count = self.state.score_count.get().copied().unwrap_or(0);
                
                self.state.total_score.set(total + score);
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
        let price_updates = self.state.price_update_count.get().copied().unwrap_or(0);
        let score_updates = self.state.score_update_count.get().copied().unwrap_or(0);
        let last_price = self.state.last_price.get().copied().unwrap_or(0.0);
        let total_score = self.state.total_score.get().copied().unwrap_or(0.0);
        let score_count = self.state.score_count.get().copied().unwrap_or(0);
        
        let avg_score = if score_count > 0 {
            total_score / score_count as f64
        } else {
            0.0
        };
        
        let data = AggregatedData {
            price_updates,
            score_updates,
            last_price,
            avg_score,
            timestamp,
        };
        
        self.runtime.emit(Event::DataAggregated(data));
    }
}
