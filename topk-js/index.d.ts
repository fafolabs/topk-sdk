/* auto-generated by NAPI-RS */
/* eslint-disable */
export declare class Client {
  constructor(config: ClientConfig)
  collections(): CollectionsClient
  collection(name: string): CollectionClient
}

export declare class CollectionClient {
  query(query: Query, lsn?: number | undefined | null): Promise<Array<Record<string, any>>>
  upsert(docs: Array<Record<string, any>>): Promise<number>
  delete(ids: Array<string>): Promise<number>
}

export declare class CollectionsClient {
  list(): Promise<Array<Collection>>
  create(options: CreateCollectionOptions): Promise<Collection>
  delete(name: string): Promise<void>
}

export declare class Expr {
  static createMatch(field: string): Expr
  static createField(name: string): Expr
  static createFunction(expr: FunctionExpression): Expr
  get expr(): Expression
  eq(value: any): Expr
  notEq(value: any): Expr
  lt(value: number): Expr
  lte(value: number): Expr
  gt(value: number): Expr
  gte(value: number): Expr
  add(value: number): Expr
  subtract(value: number): Expr
  multiply(value: number): Expr
  divide(value: number): Expr
  and(other: Expr): Expr
  or(other: Expr): Expr
  startsWith(value: string): Expr
}

export declare class Query {
  static create(stages: Array<Stage>): Query
  filter(expr: Expr): Query
  top_k(expr: Expr, k: number, asc?: boolean | undefined | null): Query
  count(): Query
  get stages(): Array<Stage>
}

export declare const enum BinaryOperator {
  And = 'And',
  Or = 'Or',
  Xor = 'Xor',
  Eq = 'Eq',
  NotEq = 'NotEq',
  Lt = 'Lt',
  LtEq = 'LtEq',
  Gt = 'Gt',
  GtEq = 'GtEq',
  StartsWith = 'StartsWith',
  Add = 'Add',
  Sub = 'Sub',
  Mul = 'Mul',
  Div = 'Div',
  Rem = 'Rem'
}

export declare function bm25Score(): Expr

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

export interface CreateCollectionOptions {
  name: string
  schema: Record<string, FieldSpec>
}

export declare const enum DataType {
  Text = 'Text',
  Integer = 'Integer',
  Float = 'Float',
  Boolean = 'Boolean',
  F32Vector = 'F32Vector',
  U8Vector = 'U8Vector',
  BinaryVector = 'BinaryVector',
  Bytes = 'Bytes'
}

export declare const enum EmbeddingDataType {
  F32 = 'F32',
  U8 = 'U8',
  /** Binary quantized uint8 */
  Binary = 'Binary'
}

export type Expression =
  | { type: 'SelectExpression', expr: SelectExpression }
  | { type: 'FilterExpression', expr: FilterExpression }
  | { type: 'LogicalExpression', expr: LogicalExpression }
  | { type: 'TextExpression', expr: TextExpression }

export declare function field(name: string): Expr

export type FieldIndex =
  | { type: 'Keyword' }
  | { type: 'Vector', metric: VectorFieldIndexMetric }
  | { type: 'Semantic', model?: string, embeddingType: EmbeddingDataType }

export interface FieldSpec {
  dataType: DataType
  required: boolean
  index?: FieldIndex
}

export type FilterExpression =
  | { type: 'Logical', expr: LogicalExpression }
  | { type: 'Text', expr: TextExpression }

export type FunctionExpression =
  | { type: 'KeywordScore' }
  | { type: 'VectorScore', field: string, query: VectorQuery }
  | { type: 'SemanticSimilarity', field: string, query: string }

export type LogicalExpression =
  | { type: 'Null' }
  | { type: 'Field', name: string }
  | { type: 'Literal', value: any }
  | { type: 'Unary', op: UnaryOperator, expr: LogicalExpression }
  | { type: 'Binary', left: LogicalExpression, op: BinaryOperator, right: LogicalExpression }

export declare function match(token: string, options?: MatchOptions | undefined | null): Expr

export interface MatchOptions {
  field: string
  weight: number
}

export declare function select(exprs: Record<string, Expr>): Query

export type SelectExpression =
  | { type: 'Logical', expr: LogicalExpression }
  | { type: 'Function', expr: FunctionExpression }

export declare function semanticSimilarity(field: string, query: string): SelectExpression

export type Stage =
  | { type: 'Select', exprs: Record<string, SelectExpression> }
  | { type: 'Filter', expr: FilterExpression }
  | { type: 'TopK', expr: LogicalExpression, k: number, asc: boolean }
  | { type: 'Count' }
  | { type: 'Rerank', model?: string, query?: string, fields: Array<string>, topkMultiple?: number }

export interface Term {
  token: string
  field?: string
  weight: number
}

export type TextExpression =
  | { type: 'Terms', all: boolean, terms: Array<Term> }
  | { type: 'And', left: TextExpression, right: TextExpression }
  | { type: 'Or', left: TextExpression, right: TextExpression }

export declare const enum UnaryOperator {
  Not = 0,
  IsNull = 1,
  IsNotNull = 2
}

export declare function vectorDistance(field: string, query: VectorQuery): SelectExpression

export declare const enum VectorFieldIndexMetric {
  Cosine = 'Cosine',
  Euclidean = 'Euclidean',
  DotProduct = 'DotProduct',
  Hamming = 'Hamming'
}

export type VectorQuery =
  | { type: 'F32', vector: Array<number> }
  | { type: 'U8', vector: Array<number> }
