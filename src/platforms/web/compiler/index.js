/* @flow */

import { baseOptions } from './options'
import { createCompiler } from 'compiler/index'
// createCompiler用以创建编译器，返回值是compile以及compileToFunctions。compile是一个编译器，它会将传入的template转换成对应的AST、render函数以及staticRenderFns函数。而compileToFunctions则是带缓存的编译器，同时staticRenderFns以及render函数会被转换成Funtion对象。
const { compile, compileToFunctions } = createCompiler(baseOptions)

export { compile, compileToFunctions }
