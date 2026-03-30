export interface IndexDBIndex {
  readonly name: string | null;
  readonly isPrimaryKey?: boolean;
}

export interface IndexDBTableSchema {
  readonly name: string;
  readonly primaryKey: IndexDBIndex;
}

export interface IndexDBTable {
  readonly name: string;
  readonly schema: IndexDBTableSchema;
}
