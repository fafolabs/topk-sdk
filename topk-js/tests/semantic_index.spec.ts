import { field, select, semanticSimilarity, match } from '../lib/query';
import { text, semanticIndex, int } from '../lib/schema';
import { newProjectContext, ProjectContext } from './setup';

describe('Semantic Index', () => {
  const contexts: ProjectContext[] = [];

  function getContext(): ProjectContext {
    const ctx = newProjectContext();
    contexts.push(ctx);
    return ctx;
  }

  afterAll(async () => {
    await Promise.all(contexts.map(ctx => ctx.deleteCollections()));
  });

  test('semantic index schema', async () => {
    const ctx = getContext();
    const collection = await ctx.createCollection('semantic', {
      title: text().required().index(semanticIndex({ model: 'dummy' })),
      summary: text().required().index(semanticIndex({ model: 'dummy' })),
      published_year: int(),
    });

    for (const field of Object.keys(collection.schema)) {
      expect(field).not.toMatch(/^_/);
    }
  });

  test('semantic index create with invalid model', async () => {
    const ctx = getContext();
    await expect(
      ctx.createCollection('semantic', {
        title: text().required().index(semanticIndex({ model: 'definitely-does-not-exist' })),
      })
    ).rejects.toThrow();
  });

  test('semantic index write docs', async () => {
    const ctx = getContext();
    const collection = await ctx.createCollection('semantic', {
      title: text().required().index(semanticIndex({ model: 'dummy' })),
      summary: text().required().index(semanticIndex({ model: 'dummy' })),
      published_year: int(),
    });

    await ctx.client.collection(collection.name).upsert([
      { _id: 'catcher', title: 'The Catcher in the Rye', summary: 'A story about a young man', published_year: 1951 },
      { _id: 'gatsby', title: 'The Great Gatsby', summary: 'A story about love and wealth', published_year: 1925 },
      { _id: 'moby', title: 'Moby Dick', summary: 'A story about a whale', published_year: 1851 },
      { _id: 'mockingbird', title: 'To Kill a Mockingbird', summary: 'A story about justice', published_year: 1960 },
      { _id: 'alchemist', title: 'The Alchemist', summary: 'A story about a journey', published_year: 1988 },
      { _id: 'harry', title: 'Harry Potter', summary: 'A story about magic', published_year: 1997 },
      { _id: 'lotr', title: 'The Lord of the Rings', summary: 'A story about a ring', published_year: 1954 },
      { _id: 'pride', title: 'Pride and Prejudice', summary: 'A story about love', published_year: 1813 },
      { _id: '1984', title: '1984', summary: 'A story about dystopia', published_year: 1949 },
      { _id: 'hobbit', title: 'The Hobbit', summary: 'A story about a hobbit', published_year: 1937 },
    ]);

    const result = await ctx.client.collection(collection.name).count();
    expect(result).toBe(10);
  });

  test('semantic index query', async () => {
    const ctx = getContext();
    const collection = await ctx.createCollection('semantic', {
      title: text().required().index(semanticIndex({ model: 'dummy' })),
      summary: text().required().index(semanticIndex({ model: 'dummy' })),
      published_year: int(),
    });

    await ctx.client.collection(collection.name).upsert([
      { _id: 'catcher', title: 'The Catcher in the Rye', summary: 'A story about a young man', published_year: 1951 },
      { _id: 'gatsby', title: 'The Great Gatsby', summary: 'A story about love and wealth', published_year: 1925 },
      { _id: 'moby', title: 'Moby Dick', summary: 'A story about a whale', published_year: 1851 },
    ]);

    const result = await ctx.client.collection(collection.name).query(
      select({ sim: semanticSimilarity('title', 'dummy') }).topK(field('sim'), 3, true)
    );

    expect(result.length).toBe(3);
  });

  test('semantic index query with text filter', async () => {
    const ctx = getContext();
    const collection = await ctx.createCollection('semantic', {
      title: text().required().index(semanticIndex({ model: 'dummy' })),
      summary: text().required().index(semanticIndex({ model: 'dummy' })),
      published_year: int(),
    });

    await ctx.client.collection(collection.name).upsert([
      { _id: 'catcher', title: 'The Catcher in the Rye', summary: 'A story about a young man', published_year: 1951 },
      { _id: 'gatsby', title: 'The Great Gatsby', summary: 'A story about love and wealth', published_year: 1925 },
      { _id: 'moby', title: 'Moby Dick', summary: 'A story about a whale', published_year: 1851 },
      { _id: 'pride', title: 'Pride and Prejudice', summary: 'A story about love', published_year: 1813 },
    ]);

    const result = await ctx.client.collection(collection.name).query(
      select({ sim: semanticSimilarity('title', 'dummy') })
        .filter(match('love', 'summary'))
        .topK(field('sim'), 3, true)
    );

    expect(new Set(result.map(doc => doc._id))).toEqual(new Set(['gatsby', 'pride']));
  });

  test('semantic index query with missing index', async () => {
    const ctx = getContext();
    const collection = await ctx.createCollection('semantic', {
      title: text().required().index(semanticIndex({ model: 'dummy' })),
      summary: text().required().index(semanticIndex({ model: 'dummy' })),
      published_year: int(),
    });

    await expect(
      ctx.client.collection(collection.name).query(
        select({ sim: semanticSimilarity('published_year', 'dummy') }).topK(field('sim'), 3, true)
      )
    ).rejects.toThrow();
  });

  test('semantic index query multiple fields', async () => {
    const ctx = getContext();
    const collection = await ctx.createCollection('semantic', {
      title: text().required().index(semanticIndex({ model: 'dummy' })),
      summary: text().required().index(semanticIndex({ model: 'dummy' })),
      published_year: int(),
    });

    await ctx.client.collection(collection.name).upsert([
      { _id: 'catcher', title: 'The Catcher in the Rye', summary: 'A story about a young man', published_year: 1951 },
      { _id: 'gatsby', title: 'The Great Gatsby', summary: 'A story about love and wealth', published_year: 1925 },
      { _id: 'moby', title: 'Moby Dick', summary: 'A story about a whale', published_year: 1851 },
      { _id: 'mockingbird', title: 'To Kill a Mockingbird', summary: 'A story about justice', published_year: 1960 },
      { _id: 'alchemist', title: 'The Alchemist', summary: 'A story about a journey', published_year: 1988 },
    ]);

    const result = await ctx.client.collection(collection.name).query(
      select({
        title_sim: semanticSimilarity('title', 'dummy'),
        summary_sim: semanticSimilarity('summary', 'query'),
      }).topK(field('title_sim').add(field('summary_sim')), 5, true)
    );

    expect(result.length).toBe(5);
  });

  test('semantic index query and rerank with missing model', async () => {
    const ctx = getContext();
    const collection = await ctx.createCollection('semantic', {
      title: text().required().index(semanticIndex({ model: 'dummy' })),
      summary: text().required().index(semanticIndex({ model: 'dummy' })),
      published_year: int(),
    });

    await expect(
      ctx.client.collection(collection.name).query(
        select({ sim: semanticSimilarity('title', 'dummy') })
          .topK(field('sim'), 3, true)
          .rerank('definitely-does-not-exist')
      )
    ).rejects.toThrow();
  });

  test('semantic index query and rerank', async () => {
    const ctx = getContext();
    const collection = await ctx.createCollection('semantic', {
      title: text().required().index(semanticIndex({ model: 'dummy' })),
      summary: text().required().index(semanticIndex({ model: 'dummy' })),
      published_year: int(),
    });

    await ctx.client.collection(collection.name).upsert([
      { _id: 'catcher', title: 'The Catcher in the Rye', summary: 'A story about a young man', published_year: 1951 },
      { _id: 'gatsby', title: 'The Great Gatsby', summary: 'A story about love and wealth', published_year: 1925 },
      { _id: 'moby', title: 'Moby Dick', summary: 'A story about a whale', published_year: 1851 },
    ]);

    const result = await ctx.client.collection(collection.name).query(
      select({ sim: semanticSimilarity('title', 'dummy') })
        .topK(field('sim'), 3, true)
        .rerank('dummy')
    );

    expect(result.length).toBe(3);
  });

  test('semantic index query and rerank multiple semantic sim explicit', async () => {
    const ctx = getContext();
    const collection = await ctx.createCollection('semantic', {
      title: text().required().index(semanticIndex({ model: 'dummy' })),
      summary: text().required().index(semanticIndex({ model: 'dummy' })),
      published_year: int(),
    });

    await ctx.client.collection(collection.name).upsert([
      { _id: 'catcher', title: 'The Catcher in the Rye', summary: 'A story about a young man', published_year: 1951 },
      { _id: 'gatsby', title: 'The Great Gatsby', summary: 'A story about love and wealth', published_year: 1925 },
      { _id: 'moby', title: 'Moby Dick', summary: 'A story about a whale', published_year: 1851 },
      { _id: 'mockingbird', title: 'To Kill a Mockingbird', summary: 'A story about justice', published_year: 1960 },
      { _id: 'alchemist', title: 'The Alchemist', summary: 'A story about a journey', published_year: 1988 },
    ]);

    const result = await ctx.client.collection(collection.name).query(
      select({
        title_sim: semanticSimilarity('title', 'dummy'),
        summary_sim: semanticSimilarity('summary', 'query'),
      })
        .topK(field('title_sim').add(field('summary_sim')), 5, true)
        .rerank('dummy', 'query string', ['title', 'summary'])
    );

    expect(result.length).toBe(5);
  });

  test('semantic index query and rerank multiple semantic sim implicit', async () => {
    const ctx = getContext();
    const collection = await ctx.createCollection('semantic', {
      title: text().required().index(semanticIndex({ model: 'dummy' })),
      summary: text().required().index(semanticIndex({ model: 'dummy' })),
      published_year: int(),
    });

    await expect(
      ctx.client.collection(collection.name).query(
        select({
          title_sim: semanticSimilarity('title', 'dummy'),
          summary_sim: semanticSimilarity('summary', 'query'),
        })
          .topK(field('title_sim').add(field('summary_sim')), 5, true)
          .rerank('dummy')
      )
    ).rejects.toThrow();
  });
});