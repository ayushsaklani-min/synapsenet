use linera_sdk::views::{linera_views, MapView, RegisterView, RootView, ViewStorageContext};
use crate::PriceData;

#[derive(RootView)]
#[view(context = "ViewStorageContext")]
pub struct PriceFeedState {
    pub prices: MapView<String, PriceData>,
    pub last_update: RegisterView<u64>,
    pub update_count: RegisterView<u64>,
}
