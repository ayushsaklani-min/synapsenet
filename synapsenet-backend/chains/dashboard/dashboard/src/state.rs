#[derive(Default)]
pub struct DashboardState {
    pub price_update_count: u64,
    pub score_update_count: u64,
    pub last_price: f64,
    pub total_score: f64,
    pub score_count: u64,
    pub last_update: u64,
}
