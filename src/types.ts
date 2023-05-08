export interface NodeInfo {
  name: string
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
