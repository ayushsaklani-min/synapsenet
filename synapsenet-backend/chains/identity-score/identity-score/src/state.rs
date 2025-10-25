use linera_sdk::views::{linera_views, RegisterView, RootView, ViewStorageContext};
use std::collections::HashMap;

#[derive(RootView)]
#[view(context = ViewStorageContext)]
pub struct IdentityScoreState {
    pub scores: RegisterView<HashMap<String, f64>>,
    pub last_update: RegisterView<u64>,
}
