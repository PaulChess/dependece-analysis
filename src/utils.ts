import type { ImportDeclaration } from 'typescript'

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
