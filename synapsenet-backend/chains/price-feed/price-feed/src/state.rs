use std::collections::HashMap;
use crate::PriceData;

#[derive(Default)]
pub struct PriceFeedState {
    pub prices: HashMap<String, PriceData>,
    pub last_update: u64,
    pub update_count: u64,
}
