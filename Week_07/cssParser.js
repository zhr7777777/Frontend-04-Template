const css = require('css')

function addCssRules(content) {
  const ast = css.parse(content)
  return ast.stylesheet.rules
}

module.exports = addCssRules