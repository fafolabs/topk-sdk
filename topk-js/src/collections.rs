use napi::bindgen_prelude::*;
use napi_derive::napi;
use std::collections::HashMap;
use std::sync::Arc;

use crate::{
    control::{collection::Collection, field_spec::FieldSpec},
    error::TopkError,
    schema::Schema,
};
use topk_protos::v1::control::{self};

#[napi]
pub struct CollectionsClient {
    client: Arc<topk_rs::Client>,
}

#[napi(object)]
pub struct CreateCollectionOptions {
    pub name: String,
    pub schema: HashMap<String, FieldSpec>,
}

#[napi]
impl CollectionsClient {
    pub fn new(client: Arc<topk_rs::Client>) -> Self {
        Self { client }
    }

    #[napi]
    pub async fn list(&self) -> Result<Vec<Collection>> {
        let collections = self
            .client
            .collections()
            .list()
            .await
            .map_err(TopkError::from)?;
        let collections_napi = collections.into_iter().map(|c| c.into()).collect();
        Ok(collections_napi)
    }

    #[napi]
    pub async fn create(&self, name: String, schema: Schema) -> Result<Collection> {
        let proto_schema: HashMap<String, control::FieldSpec> =
            schema.into_iter().map(|(k, v)| (k, v.into())).collect();

        let collection = self
            .client
            .collections()
            .create(name, proto_schema)
            .await
            .map_err(TopkError::from)?;

        Ok(collection.into())
    }

    #[napi]
    pub async fn get(&self, collection_name: String) -> Result<Collection> {
        let collection = self
            .client
            .collections()
            .get(&collection_name)
            .await
            .map_err(TopkError::from)?;

        Ok(collection.into())
    }

    #[napi]
    pub async fn delete(&self, name: String) -> Result<()> {
        self.client
            .collections()
            .delete(name)
            .await
            .map_err(TopkError::from)?;

        Ok(())
    }
}
