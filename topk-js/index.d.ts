/* auto-generated by NAPI-RS */
/* eslint-disable */
export declare class Client {
  constructor(config: ClientConfig)
  collections(): CollectionsClient
  collection(name: string): CollectionClient
}

export declare class CollectionClient {
  get(id: string, fields?: Array<string> | undefined | null, lsn?: number | undefined | null, consistency?: ConsistencyLevel | undefined | null): Promise<Record<string, any>>
  count(lsn?: number | undefined | null, consistency?: ConsistencyLevel | undefined | null): Promise<number>
  query(query: query.Query, lsn?: number | undefined | null, consistency?: ConsistencyLevel | undefined | null): Promise<Array<Record<string, any>>>
  upsert(docs: Array<Record<string, any>>): Promise<number>
  delete(ids: Array<string>): Promise<number>
}

export declare class CollectionsClient {
  list(): Promise<Array<Collection>>
  create(name: string, schema: Record<string, schema.FieldSpec>): Promise<Collection>
  get(name: string): Promise<Collection>
  delete(name: string): Promise<void>
}

export declare function binary(values: Array<number>): any

export declare function binaryVector(values: Array<number>): Vector

export interface ClientConfig {
  apiKey: string
  region: string
  host?: string
  https?: boolean
}

export interface Collection {
  name: string
  orgId: string
  projectId: string
  schema: Record<string, FieldSpec>
  region: string
}

export type ConsistencyLevel =  'indexed'|
'strong';

export interface CreateCollectionOptions {
  name: string
  schema: Record<string, schema.FieldSpec>
}

export declare function f32Vector(values: Array<number>): Vector

export interface FieldSpec {
  dataType: schema.DataType
  required: boolean
  index?: schema.FieldIndexUnion
}

export type FunctionExpression =
  | { type: 'KeywordScore' }
  | { type: 'VectorScore', field: string, query: VectorQuery }
  | { type: 'SemanticSimilarity', field: string, query: string }

export interface Term {
  token: string
  field?: string
  weight: number
}

export declare function u8Vector(values: Array<number>): Vector

export type Vector =
  | { type: 'Float', values: Array<number> }
  | { type: 'Byte', values: Array<number> }
  | { type: 'Binary', values: Array<number> }

export type VectorQuery =
  | { type: 'F32', vector: Array<number> }
  | { type: 'U8', vector: Array<number> }

export declare namespace query {
  export class LogicalExpression {
    static create(expr: LogicalExpressionUnion): LogicalExpression
    get expr(): LogicalExpressionUnion
    eq(other: LogicalExpression | string | number | boolean | null | undefined): LogicalExpression
    ne(other: LogicalExpression | string | number | boolean | null | undefined): LogicalExpression
    lt(other: LogicalExpression | number): LogicalExpression
    lte(other: LogicalExpression | number): LogicalExpression
    gt(other: LogicalExpression | number): LogicalExpression
    gte(other: LogicalExpression | number): LogicalExpression
    add(other: LogicalExpression | number): LogicalExpression
    sub(other: LogicalExpression | number): LogicalExpression
    mul(other: LogicalExpression | number): LogicalExpression
    div(other: LogicalExpression | number): LogicalExpression
    and(other: LogicalExpression | boolean): LogicalExpression
    or(other: LogicalExpression | boolean): LogicalExpression
    startsWith(other: LogicalExpression | string): LogicalExpression
  }
  export class Query {
    constructor()
    static select(exprs: Record<string, LogicalExpression | FunctionExpression>): Query
    filter(expr: LogicalExpression | TextExpression): Query
    topK(expr: LogicalExpression, k: number, asc?: boolean | undefined | null): Query
    count(): Query
    rerank(model?: string | undefined | null, query?: string | undefined | null, fields?: Array<string> | undefined | null, topkMultiple?: number | undefined | null): Query
  }
  export class TextExpression {
    static create(expr: TextExpressionUnion): TextExpression
    and(other: TextExpression): TextExpression
    or(other: TextExpression): TextExpression
  }
  export type BinaryOperator =  'and'|
  'or'|
  'eq'|
  'neq'|
  'lt'|
  'lte'|
  'gt'|
  'gte'|
  'startswith'|
  'add'|
  'sub'|
  'mul'|
  'div';
  export function bm25Score(): FunctionExpression
  export function field(name: string): LogicalExpression
  export function literal(value: number | string | boolean): LogicalExpression
  export type LogicalExpressionUnion =
    | { type: 'Null' }
    | { type: 'Field', name: string }
    | { type: 'Literal', value: number | string | boolean }
    | { type: 'Unary', op: UnaryOperator, expr: LogicalExpression }
    | { type: 'Binary', left: LogicalExpression, op: BinaryOperator, right: LogicalExpression }
  export function match(token: string, field?: string | undefined | null, weight?: number | undefined | null): TextExpression
  export function select(exprs: Record<string, LogicalExpression | FunctionExpression>): Query
  export function semanticSimilarity(field: string, query: string): FunctionExpression
  export type TextExpressionUnion =
    | { type: 'Terms', all: boolean, terms: Array<Term> }
    | { type: 'And', left: TextExpression, right: TextExpression }
    | { type: 'Or', left: TextExpression, right: TextExpression }
  export type UnaryOperator =  'not'|
  'isnull'|
  'isnotnull';
  export function vectorDistance(field: string, query: Array<number> | Vector): FunctionExpression
}

export declare namespace schema {
  export class FieldSpec {
    static create(dataType: DataType): FieldSpec
    required(): FieldSpec
    index(index: FieldIndex): FieldSpec
  }
  export function binaryVector(dimension: number): FieldSpec
  export function bool(): FieldSpec
  export function bytes(): FieldSpec
  export type DataType =
    | { type: 'Text' }
    | { type: 'Integer' }
    | { type: 'Float' }
    | { type: 'Boolean' }
    | { type: 'F32Vector', dimension: number }
    | { type: 'U8Vector', dimension: number }
    | { type: 'BinaryVector', dimension: number }
    | { type: 'Bytes' }
  export type EmbeddingDataType =  'float32'|
  'uint8'|
  'binary';
  export function f32Vector(dimension: number): FieldSpec
  export interface FieldIndex {
    index?: FieldIndexUnion
  }
  export type FieldIndexUnion =
    | { type: 'KeywordIndex', indexType: KeywordIndexType }
    | { type: 'VectorIndex', metric: VectorDistanceMetric }
    | { type: 'SemanticIndex', model?: string, embeddingType?: EmbeddingDataType }
  export function float(): FieldSpec
  export function int(): FieldSpec
  export function keywordIndex(): FieldIndex
  export type KeywordIndexType =  'text';
  export function semanticIndex(options: SemanticIndexOptions): FieldIndex
  export interface SemanticIndexOptions {
    model?: string
    embeddingType?: EmbeddingDataType
  }
  export function text(): FieldSpec
  export function u8Vector(dimension: number): FieldSpec
  export type VectorDistanceMetric =  'cosine'|
  'euclidean'|
  'dotproduct'|
  'hamming';
  export function vectorIndex(options: VectorIndexOptions): FieldIndex
  export interface VectorIndexOptions {
    metric: VectorDistanceMetric
  }
}
