/* @flow */

import { parse } from 'compiler/parser/index'
import { generate } from './codegen'
import { optimize } from './optimizer'
import { createCompilerCreator } from 'compiler/create-compiler'

/***
 *  baseCompile: 编译主逻辑
 */
export const createCompiler = createCompilerCreator(function baseCompile (
  template: string,
  options: CompilerOptions
): CompiledResult {
  /*parse解析得到AST，返回vnode*/
  const ast = parse(template.trim(), options)

  console.log('ast: ', ast);
   /*
    将AST进行优化console.log('ast: ', ast);
    优化的目标：生成模板AST，检测不需要进行DOM改变的静态子树。

    一旦检测到这些静态树，我们就能做以下这些事情：
    1.把它们变成常数，这样我们就再也不需要每次重新渲染时创建新的节点了。
    2.在patch的过程中直接跳过。
 */
  optimize(ast, options)
   /*根据AST生成所需的code（内部包含render与staticRenderFns）*/
  const code = generate(ast, options);

  return {
    ast,
    render: code.render,
    staticRenderFns: code.staticRenderFns
  }
})
