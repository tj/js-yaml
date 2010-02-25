
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
  ['string', /^"(.*?)"/],
  ['float', /^(\d+\.\d+)/],
  ['int', /^(\d+)/],
  ['id', /^(\w+)/],
  ['-', /^[-]/],
  [':', /^[:]/],
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

/**
 * Initialize with _tokens_.
 */

function Parser(tokens) {
  this.tokens = tokens
}

/**
 * Look-ahead a single token.
 *
 * @return {array}
 * @api public
 */

Parser.prototype.peek = function() {
  return this.tokens[0]
}

/**
 * Advance by a single token.
 *
 * @return {array}
 * @api public
 */

Parser.prototype.advance = function() {
  return this.tokens.shift()
}

/**
 * Advance and return the token's value.
 *
 * @return {mixed}
 * @api private
 */

Parser.prototype.advanceValue = function() {
  return this.advance()[1][1]
}

/**
 * Accept _type_ and advance or do nothing.
 *
 * @param  {string} type
 * @return {bool}
 * @api private
 */

Parser.prototype.accept = function(type) {
  if (this.peekType(type))
    return this.advance()
}

/**
 * Expect _type_ or throw an error _msg_.
 *
 * @param  {string} type
 * @param  {string} msg
 * @api private
 */

Parser.prototype.expect = function(type, msg) {
  if (!this.accept(type))
    throw new Error(msg)
}

/**
 * Return the next token type.
 *
 * @return {string}
 * @api private
 */

Parser.prototype.peekType = function(val) {
  return this.tokens[0] &&
         this.tokens[0][0] === val
}

/**
 * space+
 */

Parser.prototype.ignoreSpace = function() {
  while (this.peekType('space'))
    this.advance()
}

/**
 *   list
 * | hash
 * | int
 */

Parser.prototype.parse = function() {
  if (this.peekType('-'))
    return this.parseList()
  else if (this.peekType('id'))
    return this.parseHash()
  else if (this.peekType('string'))
    return this.advanceValue()
  else if (this.peekType('int'))
    return parseInt(this.advanceValue()) 
}

/**
 * (id ':' space+ expr space+ \n)+
 */

Parser.prototype.parseHash = function() {
  var id, hash = {}
  while (this.peekType('id') && (id = this.advanceValue()))
    this.ignoreSpace(),
    hash[id] = this.parse(),
    this.ignoreSpace(),
    this.expect('newline', 'expecting newline after hash pair')
  return hash
}

/**
 * ('-' space+ expr space+ \n)+
 */

Parser.prototype.parseList = function() {
  var list = []
  while (this.accept('-'))
    this.ignoreSpace(),
    list.push(this.parse()),
    this.ignoreSpace(),
    this.expect('newline', 'expecting newline after list item')
  return list
}

exports.eval = function(str) {
  return (new Parser(tokenize(str))).parse()
}
