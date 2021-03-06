// createAst.js
// ============
// Returns an AST (Abstract Syntax Tree) that is generated by Esprima

define([
  'errorMsgs',
  'utils',
], function(
  errorMsgs,
  utils
) {
  return function createAst(providedCode) {
    var amdclean = this,
      options = amdclean.options,
      filePath = options.filePath,
      code = providedCode || options.code || (filePath ? utils.readFile(filePath) : ''),
      esprimaOptions = options.esprima,
      escodegenOptions = options.escodegen;

    if (!code) {
      throw new Error(errorMsgs.emptyCode);
    } else {
      if (!_.isPlainObject(esprima) || !_.isFunction(esprima.parse)) {
        throw new Error(errorMsgs.esprima);
      }
      var ast = esprima.parse(code, esprimaOptions);
      if (options.sourceMap) sourcemapToAst(ast, options.sourceMap);
      // Check if both the esprima and escodegen comment options are set to true
      if (esprimaOptions.comment === true && escodegenOptions.comment === true) {
        try {
          // Needed to keep source code comments when generating the code with escodegen
          ast = escodegen.attachComments(ast, ast.comments, ast.tokens);
        } catch (e) {}
      }
      return ast;
    }
  };
});