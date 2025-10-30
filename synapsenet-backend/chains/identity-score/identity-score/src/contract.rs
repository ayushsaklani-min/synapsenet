#![cfg_attr(target_arch = "wasm32", no_main)]

mod state;

use linera_sdk::{
    abi::WithContractAbi,
    views::{RootView, View},
    Contract, ContractRuntime,
};

use identity_score::{Event, Message, Operation, ScoreData};
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
    type Message = Message;
    type Parameters = ();
    type InstantiationArgument = ();
    type EventValue = Event;

    async fn load(runtime: ContractRuntime<Self>) -> Self {
        let state = IdentityScoreState::load(runtime.root_view_storage_context())
            .await
            .expect("Failed to load state");
        IdentityScoreContract { state, runtime }
    }

    async fn instantiate(&mut self, _argument: Self::InstantiationArgument) {
        self.runtime.application_parameters();
    }

    async fn execute_operation(&mut self, operation: Self::Operation) -> Self::Response {
        let timestamp = self.runtime.system_time().micros();
        
        match operation {
            Operation::UpdateScore { user_id, score, reason } => {
                let tx_count = self.state.transaction_counts.get(&user_id)
                    .await
                    .expect("Failed to get tx count")
                    .unwrap_or(0);
                let success_count = self.state.success_counts.get(&user_id)
                    .await
                    .expect("Failed to get success count")
                    .unwrap_or(0);
                
                let success_rate = if tx_count > 0 {
                    (success_count as f64 / tx_count as f64) * 100.0
                } else {
                    100.0
                };
                
                let score_data = ScoreData {
                    user_id: user_id.clone(),
                    score,
                    timestamp,
                    reason,
                    transaction_count: tx_count,
                    success_rate,
                };
                
                self.state.scores.insert(&user_id, score_data.clone())
                    .expect("Failed to insert score");
                self.state.last_update.set(timestamp);
                
                // self.runtime.emit(Event::ScoreUpdated(score_data));
            }
            
            Operation::RecordTransaction { user_id, transaction_type, success } => {
                // Update transaction counts using MapView
                let tx_count = self.state.transaction_counts.get(&user_id)
                    .await
                    .expect("Failed to get tx count")
                    .unwrap_or(0);
                self.state.transaction_counts.insert(&user_id, tx_count + 1)
                    .expect("Failed to insert tx count");
                
                if success {
                    let success_count = self.state.success_counts.get(&user_id)
                        .await
                        .expect("Failed to get success count")
                        .unwrap_or(0);
                    self.state.success_counts.insert(&user_id, success_count + 1)
                        .expect("Failed to insert success count");
                }
                
                // Calculate new score based on success rate
                let new_tx_count = tx_count + 1;
                let new_success_count = self.state.success_counts.get(&user_id)
                    .await
                    .expect("Failed to get success count")
                    .unwrap_or(0);
                let success_rate = (new_success_count as f64 / new_tx_count as f64) * 100.0;
                
                // Dynamic score: base 50 + success_rate/2
                let new_score = 50.0 + (success_rate / 2.0);
                
                let score_data = ScoreData {
                    user_id: user_id.clone(),
                    score: new_score,
                    timestamp,
                    reason: format!("Transaction recorded: {}", transaction_type),
                    transaction_count: new_tx_count,
                    success_rate,
                };
                
                self.state.scores.insert(&user_id, score_data.clone())
                    .expect("Failed to insert score");
                self.state.last_update.set(timestamp);
                
                // self.runtime.emit(Event::TransactionRecorded {
                //     user_id,
                //     transaction_type,
                //     success,
                //     new_score,
                // });
            }
        }
    }

    async fn execute_message(&mut self, message: Self::Message) {
        match message {
            Message::ScoreUpdate(score_data) => {
                self.state.scores.insert(&score_data.user_id, score_data.clone())
                    .expect("Failed to insert score");
                self.state.last_update.set(score_data.timestamp);
                
                // self.runtime.emit(Event::ScoreUpdated(score_data));
            }
        }
    }

    async fn store(mut self) {
        self.state.save().await.expect("Failed to save state");
    }
}
