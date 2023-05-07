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
            // 局部导入场景
            if (node.importClause.namedBindings) {
              // 拓展导入场景，包括 as 情况
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
              // * 全量导入as场景
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

  _dealAST() {}

  analysis() {
    const tartgetAnalysisFile = scanFileTs('example/src/main.ts')

    if (isTrueArray(tartgetAnalysisFile)) {
      tartgetAnalysisFile.forEach((file) => {
        const { ast } = parseTs(file)

        if (ast) {
          const importItems = this._findImportItems(ast)
          // console.log(importItems)

          if (Object.keys(importItems).length > 0)
            this._dealAST()
        }
      })
    }
  }
}
