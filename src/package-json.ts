import { accessSync, constants, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { packageDirectory } from 'pkg-dir'

interface FindPackageJsonRes {
  exists: boolean
  parentPath: string | null
  filePath: string | null
}

export async function findPackageJsonPath(dir: string) {
  const rootPath = await packageDirectory({
    cwd: dir,
  })

  let result: FindPackageJsonRes = {
    exists: false,
    parentPath: null,
    filePath: null,
  }

  if (rootPath) {
    const packageJsonPath = join(rootPath, 'package.json')

    try {
      await accessSync(packageJsonPath, constants.F_OK)
      result = {
        exists: true,
        parentPath: rootPath,
        filePath: packageJsonPath,
      }
    }
    catch (err) {
      console.error(`${packageJsonPath} does not exits`)
    }
  }
  return result
}

export async function readPackageJson(packageJsonPath: string) {
  const fileContent = await readFileSync(packageJsonPath, 'utf-8')

  try {
    const json = JSON.parse(fileContent)
    return json
  }
  catch (err) {
    //
  }
}
