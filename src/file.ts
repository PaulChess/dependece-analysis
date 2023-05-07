import { join } from 'node:path'
import * as glob from 'glob'

// 扫描JS文件
export function scanFileJs(scanPath: string) {
  // 单文件
  if (scanPath.endsWith('.js') || scanPath.endsWith('.jsx'))
    return [join(process.cwd(), scanPath)]

  // 目录
  const jsFiles = glob.sync(join(process.cwd(), `${scanPath}/**/*.js`))
  const jsxFiles = glob.sync(join(process.cwd(), `${scanPath}/**/*.jsx`))
  return jsFiles.concat(jsxFiles)
}

// 扫描TS文件
export function scanFileTs(scanPath: string) {
  // 单文件
  if (scanPath.endsWith('.ts') || scanPath.endsWith('.tsx'))
    return [join(process.cwd(), scanPath)]

  // 目录
  const tsFiles = glob.sync(join(process.cwd(), `${scanPath}/**/*.ts`))
  const tsxFiles = glob.sync(join(process.cwd(), `${scanPath}/**/*.tsx`))
  return tsFiles.concat(tsxFiles)
}
