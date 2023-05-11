// import { CodeAnalysis } from './analysis'
import { isPlainObject } from 'lodash-es'
import { findPackageJsonPath, readPackageJson } from './package-json'
import { isTrueArray } from './utils'
import type { ComponentData } from './types'

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
  }[] = []
  Object.keys(dependecies).forEach((dependence) => {
    if (dependence.startsWith('@atom/')) {
      atomPrefixDependencies.push({
        libraryName: dependence,
        version: dependecies[dependence],
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
          atomPrefixDependencies.forEach((atomPrefixDependence) => {
            componentsData.librariyInfoList.push({
              libraryName: atomPrefixDependence.libraryName,
              version: atomPrefixDependence.version,
              components: [],
              usages: 0,
            })
          })
        }
      }
    }
  }
  // console.log(componentsData)
}

init()

// const codeAnalysis = new CodeAnalysis()

// codeAnalysis.analysis()
