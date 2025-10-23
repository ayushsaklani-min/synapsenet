use linera_sdk::views::{linera_views, RegisterView, RootView, ViewStorageContext};
use linera_base::data_types::ChainId;

#[derive(RootView, async_graphql::SimpleObject)]
#[view(context = ViewStorageContext)]
pub struct PriceFeedState {
    pub prices: RegisterView<Vec<(String, f64)>>,
    pub last_update: RegisterView<u64>,
    pub chain_id: RegisterView<ChainId>,
}
