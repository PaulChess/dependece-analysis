export interface ChildComponentItem {
  componentName: string
  usages?: number
}

export type ChildComponents = ChildComponentItem[]

export interface LibraryInfoItem {
  libraryName: string
  version: string
  usages?: number
  components: ChildComponents
}

export interface ComponentData {
  projectRepo: string
  librariyInfoList: LibraryInfoItem[]
}

export interface CodeAnalysisOptions {
  libraryName: string
}

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
