#![deny(clippy::all)]

mod client;
mod collections;
mod control;
mod data;
mod error;
use crate::client::ClientConfig;
use napi_derive::napi;
use std::sync::Arc;
use topk_rs::{Client as RsClient, ClientConfig as RsClientConfig};

#[napi]
pub struct Client {
    client: Arc<RsClient>,
}

#[napi]
impl Client {
    #[napi(constructor)]
    pub fn new(config: ClientConfig) -> Self {
        let mut rs_config = RsClientConfig::new(config.api_key, config.region);

        if let Some(host_value) = config.host {
            rs_config = rs_config.with_host(host_value);
        }

        if let Some(https_value) = config.https {
            rs_config = rs_config.with_https(https_value);
        }

        let client = Arc::new(RsClient::new(rs_config));

        Self { client }
    }

    #[napi]
    pub fn collections(&self) -> collections::CollectionsClient {
        collections::CollectionsClient::new(self.client.clone())
    }

    #[napi]
    pub fn collection(&self, name: String) -> control::collection::CollectionClient {
        control::collection::CollectionClient::new(self.client.clone(), name)
    }
}
