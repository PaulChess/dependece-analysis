import type { ImportDeclaration } from 'typescript'
import type { ImportType, NodeType } from './types'
import { IMPORT_TYPE, NODE_TYPE } from './constant'

const TargetFrameworkName = ['@atom/atom-ui', 'vue']

export function isTrueArray(arr: unknown) {
  return arr && Array.isArray(arr) && arr.length > 0
}

export function formatModuleSpecifierText(text: string) {
  return text.replace(/['"]/g, '')
}

export function getFormatedModuleSpecifierText(node: ImportDeclaration) {
  return formatModuleSpecifierText(node.moduleSpecifier.getText())
}

export function isTargetLib(node: ImportDeclaration) {
  return node.moduleSpecifier
    && node.moduleSpecifier.getText()
    && TargetFrameworkName.includes(formatModuleSpecifierText(node.moduleSpecifier.getText()))
}

export function getNodeType(node: ImportDeclaration, importType: ImportType): NodeType {
  const moduleSpecifierText = getFormatedModuleSpecifierText(node)

  if (moduleSpecifierText === 'vue' || moduleSpecifierText === 'createApp')
    return NODE_TYPE.VUE as NodeType

  else if (importType === IMPORT_TYPE.DEFAULT || importType === IMPORT_TYPE.DEFAULT_AS)
    return NODE_TYPE.COMPONENT_LIB as NodeType

  else
    return NODE_TYPE.COMPONENT as NodeType
}
