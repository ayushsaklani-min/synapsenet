use linera_sdk::views::{linera_views, MapView, RegisterView, RootView, ViewStorageContext};
use crate::ScoreData;

#[derive(RootView)]
#[view(context = "ViewStorageContext")]
pub struct IdentityScoreState {
    pub scores: MapView<String, ScoreData>,
    pub transaction_counts: MapView<String, u64>,
    pub success_counts: MapView<String, u64>,
    pub last_update: RegisterView<u64>,
}
