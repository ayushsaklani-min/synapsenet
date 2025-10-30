use std::collections::HashMap;
use crate::ScoreData;

#[derive(Default)]
pub struct IdentityScoreState {
    pub scores: HashMap<String, ScoreData>,
    pub transaction_counts: HashMap<String, u64>,
    pub success_counts: HashMap<String, u64>,
    pub last_update: u64,
}
