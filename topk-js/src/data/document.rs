use std::collections::HashMap;

use super::value::Value;

pub struct Document {
    fields: HashMap<String, Value>,
}

impl From<Document> for topk_protos::v1::data::Document {
    fn from(doc: Document) -> Self {
        topk_protos::v1::data::Document {
            fields: doc.fields.into_iter().map(|(k, v)| (k, v.into())).collect(),
        }
    }
}

impl From<topk_protos::v1::data::Document> for Document {
    fn from(doc: topk_protos::v1::data::Document) -> Self {
        Document {
            fields: doc.fields.into_iter().map(|(k, v)| (k, v.into())).collect(),
        }
    }
}

pub struct NapiDocument(topk_protos::v1::data::Document);

impl From<topk_protos::v1::data::Document> for NapiDocument {
    fn from(doc: topk_protos::v1::data::Document) -> Self {
        Self(doc)
    }
}

impl From<NapiDocument> for HashMap<String, Value> {
    fn from(wrapper: NapiDocument) -> Self {
        wrapper
            .0
            .fields
            .into_iter()
            .map(|(k, v)| (k, v.into()))
            .collect()
    }
}
