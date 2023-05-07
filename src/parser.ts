import tsCompiler from 'typescript'

export function parseTs(file: string) {
  const program = tsCompiler.createProgram([file], {})
  const ast = program.getSourceFile(file)
  const checker = program.getTypeChecker()

  return {
    ast,
    checker,
  }
}
