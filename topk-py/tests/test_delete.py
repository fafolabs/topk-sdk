import pytest
from topk_sdk import error
from topk_sdk.query import field, top_k

from . import ProjectContext


def test_delete_from_non_existent_collection(ctx: ProjectContext):
    with pytest.raises(error.CollectionNotFoundError):
        ctx.client.collection("missing").delete(["one"])


def test_delete_document(ctx: ProjectContext):
    collection = ctx.client.collections().create(ctx.scope("test"), schema={})

    lsn = ctx.client.collection(collection.name).upsert(
        [{"_id": "one", "rank": 1}, {"_id": "two", "rank": 2}]
    )
    assert lsn == 1

    # wait for write to be flushed
    ctx.client.collection(collection.name).count()

    lsn = ctx.client.collection(collection.name).delete(["one"])
    assert lsn == 2

    docs = ctx.client.collection(collection.name).query(
        top_k(field("rank"), 100, True), lsn=lsn
    )

    doc_ids = {doc["_id"] for doc in docs}
    assert doc_ids == {"two"}


def test_delete_non_existent_document(ctx: ProjectContext):
    collection = ctx.client.collections().create(ctx.scope("test"), schema={})

    # we can delete a non-existent document, and it will be ignored
    lsn = ctx.client.collection(collection.name).delete(["one"])
    assert lsn == 1
