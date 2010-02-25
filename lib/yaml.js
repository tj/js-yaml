
// YAML - Core - Copyright TJ Holowaychuk <tj@vision-media.ca> (MIT Licensed)

/**
 * Version triplet.
 */

exports.version = '0.0.1'

/**
 * YAML grammar tokens.
 */

var tokens = [
  ['indent', /^\n( )+/],
  ['space', /^ +/],
  ['newline', /^\n/],
  ['listItem', /^-/],
  ['float', /^(\d+\.\d+)/],
  ['int', /^(\d+)/],
]

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

// --- Parser

function Parser(tokens) {
  this.tokens = tokens
}

Parser.prototype.peek = function() {
  return this.tokens[0]
}

Parser.prototype.advance = function() {
  return this.tokens.shift()
}

Parser.prototype.advanceValue = function() {
  return this.advance()[1][1]
}

Parser.prototype.accept = function(type) {
  if (this.peekType(type))
    return this.advance()
}

Parser.prototype.expect = function(type, msg) {
  if (!this.accept(type))
    throw new Error(msg)
}

Parser.prototype.peekType = function(val) {
  return this.tokens[0] &&
         this.tokens[0][0] === val
}

Parser.prototype.ignoreSpace = function() {
  while (this.peekType('space'))
    this.advance()
}

Parser.prototype.parse = function() {
  if (this.peekType('listItem'))
    return this.parseList()
  else if (this.peekType('int'))
    return parseInt(this.advanceValue()) 
}

/**
 *  ('-' int \n)+
 */

Parser.prototype.parseList = function() {
  var list = []
  while (this.accept('listItem'))
    this.ignoreSpace(),
    list.push(this.parse()),
    this.expect('newline', 'expected newline after list item')
  return list
}

exports.eval = function(str) {
  return (new Parser(tokenize(str))).parse()
}
