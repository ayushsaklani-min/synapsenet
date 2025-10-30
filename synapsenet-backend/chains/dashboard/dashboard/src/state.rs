use linera_sdk::views::{RegisterView, RootView, ViewStorageContext};

#[derive(RootView)]
pub struct DashboardState {
    pub price_update_count: RegisterView<u64>,
    pub score_update_count: RegisterView<u64>,
    pub last_price: RegisterView<f64>,
    pub total_score: RegisterView<f64>,
    pub score_count: RegisterView<u64>,
    pub last_update: RegisterView<u64>,
}
