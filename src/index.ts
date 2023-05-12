import { isPlainObject } from 'lodash-es'
import { findPackageJsonPath, readPackageJson } from './package-json'
import { isTrueArray } from './utils'
import type { ComponentData, LibraryInfoItem } from './types'
import { NEED_DEEP_ANALYSIS_LIB } from './constant'
import { CodeAnalysis } from './analysis'

const componentsData: ComponentData = {
  projectRepo: '',
  librariyInfoList: [],
}

function getProjectRepo() {
  // TODO: 从环境变量中读取
  return 'http://gitlab.myhexin.com/example/example.git'
}

// function getLibraryInfoList() {}

function getAtomPrefixDependencies(dependecies: Record<string, string>) {
  const atomPrefixDependencies: {
    libraryName: string
    version: string
    needDeepAnalysis: boolean
  }[] = []
  Object.keys(dependecies).forEach((dependenceName) => {
    if (dependenceName.startsWith('@atom/')) {
      atomPrefixDependencies.push({
        libraryName: dependenceName,
        version: dependecies[dependenceName],
        needDeepAnalysis: NEED_DEEP_ANALYSIS_LIB.includes(dependenceName),
      })
    }
  })
  return atomPrefixDependencies
}

async function init() {
  componentsData.projectRepo = getProjectRepo()

  const result = await findPackageJsonPath('example')
  if (result.exists && result.filePath) {
    const packageJson = await readPackageJson(result.filePath)

    if (packageJson) {
      const { dependencies } = packageJson
      if (isPlainObject(dependencies) && Object.keys(dependencies).length > 0) {
        const atomPrefixDependencies = getAtomPrefixDependencies(dependencies)
        if (isTrueArray(atomPrefixDependencies)) {
          atomPrefixDependencies.forEach(async (atomPrefixDependence) => {
            const libraryInfo: LibraryInfoItem = {
              libraryName: atomPrefixDependence.libraryName,
              version: atomPrefixDependence.version,
              components: [],
            }
            if (atomPrefixDependence.needDeepAnalysis) {
              const codeAnalysis = new CodeAnalysis({
                libraryName: atomPrefixDependence.libraryName,
              })
              const usedComponents = await codeAnalysis.analysis()

              if (isTrueArray(usedComponents)) {
                usedComponents.forEach((item, index) => {
                  libraryInfo.components.splice(index, 0, {
                    componentName: item,
                    usages: 0,
                  })
                })
              }
            }
            else {
              libraryInfo.usages = 0
            }

            componentsData.librariyInfoList.push(libraryInfo)
            // console.log(componentsData)
          })
        }
      }
    }
  }
}

init()
