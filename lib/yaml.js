
// YAML - Core - Copyright TJ Holowaychuk <tj@vision-media.ca> (MIT Licensed)

/**
 * Version triplet.
 */

exports.version = '0.0.1'

/**
 * YAML grammar tokens.
 */

var tokens = [
  ['comment', /^#[^\n]*/],
  ['indent', /^\n( *)/],
  ['space', /^ +/],
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
  var token, captures,
      indents = lastIndents = 0,
      stack = []
  while (str.length) {
    for (var i = 0, len = tokens.length; i < len; ++i)
      if (captures = tokens[i][1].exec(str)) {
        token = [tokens[i][0], captures],
        str = str.replace(tokens[i][1], '')
        if (token[0] === 'indent') {
          lastIndents = indents
          indents = token[1][1].length / 2
          if (indents === lastIndents)
            continue
          else if (indents > lastIndents + 1)
            throw new Error('invalid indentation, got ' + indents + ' instead of ' + (lastIndents + 1))
          else if (indents < lastIndents) {
            token = ['dedent']
            while (--lastIndents >= 0)
              stack.push(['dedent'])
          }
        }
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
 * space*
 */

Parser.prototype.ignoreSpace = function() {
  while (this.peekType('space'))
    this.advance()
}

/**
 *   block
 * | list
 * | hash
 * | string
 * | float
 * | int
 */

Parser.prototype.parse = function() {
  switch (this.peek()[0]) {
    case '-':
      return this.parseList()
    case 'id':
      return this.parseHash()
    case 'string':
      return this.advanceValue()
    case 'float':
      return parseFloat(this.advanceValue())
    case 'int':
      return parseInt(this.advanceValue())
  }
}

/**
 * (id ':' - expr -)+
 */

Parser.prototype.parseHash = function() {
  var id, hash = {}
  while (this.peekType('id') && (id = this.advanceValue()))
    this.expect(':', 'expected semi-colon after id'),
    this.ignoreSpace(),
    hash[id] = this.parse(),
    this.ignoreSpace()
  return hash
}

/**
 *  ( '-' - expr -
 *  | '-' - indent expr dedent
 *  )+
 */

Parser.prototype.parseList = function() {
  var list = []
  while (this.accept('-')) {
    this.ignoreSpace()
    if (this.accept('indent'))
      list.push(this.parse()),
      this.expect('dedent', 'list item not properly dedented')
    else
      list.push(this.parse())
    this.ignoreSpace()
  }
  return list
}

exports.eval = function(str) {
  return (new Parser(tokenize(str))).parse()
}
