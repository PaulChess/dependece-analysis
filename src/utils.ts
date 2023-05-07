import type { ImportDeclaration } from 'typescript'

const TargetFrameworkName = '@atom/atom-ui'

export function isTrueArray(arr: unknown) {
  return arr && Array.isArray(arr) && arr.length > 0
}

export function formatModuleSpecifierText(text: string) {
  return text.replace(/['"]/g, '')
}

export function isTargetLib(node: ImportDeclaration) {
  return node.moduleSpecifier
    && node.moduleSpecifier.getText()
    && formatModuleSpecifierText(node.moduleSpecifier.getText()) === TargetFrameworkName
}
