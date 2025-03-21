/* auto-generated by NAPI-RS */
/* eslint-disable */
export declare class Client {
  constructor(config: ClientConfig)
  collections(): CollectionsClient
  collection(name: string): CollectionClient
}

export declare class CollectionClient {
  query(query: string): string
}

export declare class CollectionsClient {
  list(): Promise<Array<Collection>>
  create(options: CreateCollectionOptions): Promise<Collection>
  delete(name: string): Promise<void>
}

export interface ClientConfig {
  apiKey: string
  region: string
  host?: string
  https?: boolean
}

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

export type FieldIndex =
  | { type: 'Keyword' }
  | { type: 'Vector', metric: VectorFieldIndexMetric }
  | { type: 'Semantic', model?: string, embeddingType: EmbeddingDataType }

export interface FieldSpec {
  dataType: DataType
  required: boolean
  index?: FieldIndex
}

export declare const enum VectorFieldIndexMetric {
  Cosine = 'Cosine',
  Euclidean = 'Euclidean',
  DotProduct = 'DotProduct',
  Hamming = 'Hamming'
}
