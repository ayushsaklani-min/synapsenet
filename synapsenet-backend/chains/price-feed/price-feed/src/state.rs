use std::collections::HashMap;
use serde::{Deserialize, Serialize};
use crate::PriceData;

#[derive(Default, Clone, Serialize, Deserialize)]
pub struct PriceFeedState {
    pub prices: HashMap<String, PriceData>,
    pub last_update: u64,
    pub update_count: u64,
}
