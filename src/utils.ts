import type { ImportDeclaration } from 'typescript'

export function isTrueArray(arr: unknown) {
  return arr && Array.isArray(arr) && arr.length > 0
}

export function formatModuleSpecifierText(text: string) {
  return text.replace(/['"]/g, '')
}

export function getFormatedModuleSpecifierText(node: ImportDeclaration) {
  return formatModuleSpecifierText(node.moduleSpecifier.getText())
}

export function isTargetLib(node: ImportDeclaration, libraryName: string) {
  return node.moduleSpecifier
    && node.moduleSpecifier.getText()
    && formatModuleSpecifierText(node.moduleSpecifier.getText()) === libraryName
}
