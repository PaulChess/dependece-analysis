import type { Node, SourceFile } from 'typescript'
import tsCompiler from 'typescript'
import { scanFileTs } from './file'
import { getNodeType, isTargetLib, isTrueArray } from './utils'
import { parseTs } from './parser'
import { IMPORT_TYPE } from './constant'
import type { ImportItems, ImportType, NodeInfo } from './types'

export class CodeAnalysis {
  constructor() {}

  _findImportItems(ast: SourceFile, baseLine = 0) {
    const importItems: ImportItems = {}

    function dealImports(nodeInfo: NodeInfo) {
      importItems[nodeInfo.name] = {
        importType: nodeInfo.importType,
        nodeType: nodeInfo.nodeType,
        origin: nodeInfo.origin,
        symbolPos: nodeInfo.symbolPos,
        symbolEnd: nodeInfo.symbolEnd,
        identifierPos: nodeInfo.identifierPos,
        identifierEnd: nodeInfo.identifierEnd,
        line: nodeInfo.line,
      }
    }

    function walk(node: Node) {
      tsCompiler.forEachChild(node, walk)
      const line = ast.getLineAndCharacterOfPosition(node.getStart()).line + baseLine + 1

      if (tsCompiler.isImportDeclaration(node)) {
        // 命中target
        if (isTargetLib(node)) {
          // 存在导入项
          if (node.importClause) {
            // default 直接导入场景
            if (node.importClause.name) {
              const importType = IMPORT_TYPE.DEFAULT as ImportType
              const nodeInfo = {
                name: node.importClause.name.escapedText as string,
                nodeType: getNodeType(node, importType),
                importType,
                origin: null,
                symbolPos: node.importClause.pos,
                symbolEnd: node.importClause.end,
                identifierPos: node.importClause.name.pos,
                identifierEnd: node.importClause.name.end,
                line,
              }
              dealImports(nodeInfo)
            }
            if (node.importClause.namedBindings) {
              if (tsCompiler.isNamedImports(node.importClause.namedBindings)) {
                if (node.importClause.namedBindings.elements && node.importClause.namedBindings.elements.length > 0) {
                  const elementsArr = node.importClause.namedBindings.elements
                  elementsArr.forEach((element) => {
                    if (tsCompiler.isImportSpecifier(element)) {
                      const importType = element.propertyName ? IMPORT_TYPE.NAMESPACE_AS as ImportType : IMPORT_TYPE.NAMESPACE as ImportType
                      const nodeInfo = {
                        name: element.name.escapedText as string,
                        nodeType: getNodeType(node, importType),
                        importType,
                        origin: element.propertyName ? element.propertyName.escapedText as string : null,
                        symbolPos: element.pos,
                        symbolEnd: element.end,
                        identifierPos: element.name.pos,
                        identifierEnd: element.name.end,
                        line,
                      }
                      dealImports(nodeInfo)
                    }
                  })
                }
              }
              if (tsCompiler.isNamespaceImport(node.importClause.namedBindings) && node.importClause.namedBindings.name) {
                const importType = IMPORT_TYPE.DEFAULT_AS as ImportType
                const nodeInfo = {
                  name: node.importClause.namedBindings.name.escapedText as string,
                  nodeType: getNodeType(node, importType),
                  importType,
                  origin: '*',
                  symbolPos: node.importClause.namedBindings.pos,
                  symbolEnd: node.importClause.namedBindings.end,
                  identifierPos: node.importClause.namedBindings.name.pos,
                  identifierEnd: node.importClause.namedBindings.name.end,
                  line,
                }
                dealImports(nodeInfo)
              }
            }
          }
        }
      }
    }

    walk(ast)

    return importItems
  }

  _getUseCallsList(ast: SourceFile) {
    const useCalls: string[] = []

    function walk(node: Node) {
      tsCompiler.forEachChild(node, walk)

      if (tsCompiler.isCallExpression(node)) {
        const expression = node.expression
        if (tsCompiler.isPropertyAccessExpression(expression) && expression.name.text === 'use')
          useCalls.push(node.arguments[0].getText())
      }
    }

    walk(ast)

    return useCalls
  }

  _getRealUsedComponentsList(componentItems: ImportItems, useCallsList: string[]) {
    const realUsedComponentsList: string[] = []

    Object.keys(componentItems).forEach((key) => {
      if (useCallsList.includes(key))
        realUsedComponentsList.push(key)
    })

    return realUsedComponentsList
  }

  _getVueItems(importItems: ImportItems) {
    const vueItems: ImportItems = {}

    Object.keys(importItems).forEach((key) => {
      const item = importItems[key]
      if ((key === 'createApp' || key === 'Vue') && item.nodeType === 'vue')
        vueItems[key] = item
    })

    return vueItems
  }

  _getComponentItems(importItems: ImportItems) {
    const componentItems: ImportItems = {}

    Object.keys(importItems).forEach((key) => {
      const item = importItems[key]
      if (item.nodeType === 'component' || item.nodeType === 'componentLib')
        componentItems[key] = item
    })

    return componentItems
  }

  analysis() {
    const tartgetAnalysisFile = scanFileTs('example/src/main.ts')

    if (isTrueArray(tartgetAnalysisFile)) {
      tartgetAnalysisFile.forEach((file) => {
        const { ast } = parseTs(file)

        if (ast) {
          const importItems = this._findImportItems(ast)

          if (Object.keys(importItems).length > 0) {
            const componentItems = this._getComponentItems(importItems)
            const useCallsList = this._getUseCallsList(ast)
            const realUsedComponentList = this._getRealUsedComponentsList(componentItems, useCallsList)
            // console.log(realUsedComponentList)
          }
        }
      })
    }
  }
}
