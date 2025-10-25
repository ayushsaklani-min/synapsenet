use linera_sdk::views::{linera_views, RegisterView, RootView, ViewStorageContext};

#[derive(RootView)]
#[view(context = ViewStorageContext)]
pub struct DashboardState {
    pub received_events: RegisterView<Vec<String>>,
}
