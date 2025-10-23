use linera_sdk::views::{linera_views, RegisterView, RootView, ViewStorageContext};
use linera_base::data_types::ChainId;

#[derive(RootView, async_graphql::SimpleObject)]
#[view(context = ViewStorageContext)]
pub struct DashboardState {
    pub received_events: RegisterView<Vec<String>>,
    pub chain_id: RegisterView<ChainId>,
}
