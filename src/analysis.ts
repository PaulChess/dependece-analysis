import type { Node, SourceFile } from 'typescript'
import tsCompiler from 'typescript'
import { scanFileTs } from './file'
import { isTargetLib, isTrueArray } from './utils'
import { parseTs } from './parser'

interface NodeInfo {
  name: string
  origin: string | null
  symbolPos: number
  symbolEnd: number
  identifierPos: number
  identifierEnd: number
  line: number
}

interface ImportItems {
  [key: string]: Omit<NodeInfo, 'name'>
}

export class CodeAnalysis {
  constructor() {}

  _findImportItems(ast: SourceFile, baseLine = 0) {
    const importItems: ImportItems = {}

    function dealImports(nodeInfo: NodeInfo) {
      importItems[nodeInfo.name] = {
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
              const nodeInfo = {
                name: node.importClause.name.escapedText as string,
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
                      const nodeInfo = {
                        name: element.name.escapedText as string,
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
                const nodeInfo = {
                  name: node.importClause.namedBindings.name.escapedText as string,
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

          if (Object.keys(importItems).length > 0)
            this._dealAST()
        }
      })
    }
  }
}