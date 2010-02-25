
// YAML - Core - Copyright TJ Holowaychuk <tj@vision-media.ca> (MIT Licensed)

/**
 * Version triplet.
 */

exports.version = '0.0.1'

/**
 * Sass grammar tokens.
 */

var tokens = [
  ['---', /^\n +/],
]

/**
 * Vendor-specific expansion prefixes.
 */

exports.expansions = ['-moz-', '-webkit-']

/**
 * Tokenize the given _str_.
 *
 * @param  {string} str
 * @return {array}
 * @api private
 */

function tokenize(str) {
  var token, captures, stack = []
  while (str.length) {
    for (var i = 0, len = tokens.length; i < len; ++i)
      if (captures = tokens[i][1].exec(str)) {
        token = [tokens[i][0], captures],
        str = str.replace(tokens[i][1], '')
        break
      }
    if (token)
      stack.push(token),
      token = null
    else 
      throw new Error("SyntaxError: near `" + str.slice(0, 25).replace('\n', '\\n') + "'")
  }
  return stack
}

exports.eval = function(str) {
  require('sys').p(tokenize(str))
}
