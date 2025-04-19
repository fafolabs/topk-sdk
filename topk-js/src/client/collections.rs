use napi::bindgen_prelude::*;
use napi_derive::napi;
use std::collections::HashMap;
use std::sync::Arc;

use crate::{
    data::collection::{Collection, CollectionFieldSpec},
    error::TopkError,
    schema::field_spec::FieldSpec,
};
use topk_protos::v1::control::{self};

#[napi]
pub struct CollectionsClient {
    client: Arc<topk_rs::Client>,
}

#[napi(object)]
pub struct CreateCollectionOptions {
    pub name: String,
    #[napi(ts_type = "Record<string, schema.FieldSpec>")]
    pub schema: HashMap<String, CollectionFieldSpec>,
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
        Ok(collections.into_iter().map(|c| c.into()).collect())
    }

    #[napi]
    pub async fn create(
        &self,
        name: String,
        #[napi(ts_arg_type = "Record<string, schema.FieldSpec>")] schema: HashMap<
            String,
            FieldSpec,
        >,
    ) -> Result<Collection> {
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
    pub async fn get(&self, name: String) -> Result<Collection> {
        let collection = self
            .client
            .collections()
            .get(&name)
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
