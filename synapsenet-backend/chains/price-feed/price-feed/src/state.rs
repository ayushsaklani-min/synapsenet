use linera_sdk::views::{linera_views, RegisterView, RootView, ViewStorageContext};

#[derive(RootView)]
#[view(context = ViewStorageContext)]
pub struct PriceFeedState {
    pub prices: RegisterView<Vec<(String, f64)>>,
    pub last_update: RegisterView<u64>,
}
