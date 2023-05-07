export type NodeType = 'vue' | 'componentLib' | 'component'

export type ImportType = 'default' | 'defaultAs' | 'namespace' | 'namespaceAs'

export interface NodeInfo {
  name: string
  nodeType: NodeType
  importType: ImportType
  origin: string | null
  symbolPos: number
  symbolEnd: number
  identifierPos: number
  identifierEnd: number
  line: number
}

export interface ImportItems {
  [key: string]: Omit<NodeInfo, 'name'>
}
