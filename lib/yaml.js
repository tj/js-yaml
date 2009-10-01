
;(function(){
  YAML = {
    
    /**
     * Value of the given _token_.
     *
     * The following conversion are made, otherwise
     * the _token_ is passed to eval().
     *
     *   true  | yes | on    // => true
     *   false | no  | off   // => false
     *
     * @param  {string} token
     * @return {mixed}
     * @api private
     */
    
    valueOf: function(token) {
      switch (token) {
        case 'true':
        case 'yes':
        case 'on':
          return true
          
        case 'false':
        case 'no':
        case 'off':
          return false
          
        default:
          return eval('(' + token + ')')
      }
    },
    
    /**
     * Tokenize _str_.
     *
     * @param  {string} str
     * @return {array}
     * @api private
     */
    
    tokenize: function(str) {
      return str.match(/(---|true|yes|on|false|no|off|null|#(.*)|\[(.*?)\]|\{(.*?)\}|[\w\-]+:|-(.+)|\d+\.\d+|\d+|\n+)/g)
    },
    
    /**
     * Strip leading / trailing whitespace from _str_.
     *
     * @param  {string} str
     * @return {string}
     * @api private
     */
    
    strip: function(str) {
      return str.replace(/^\s*|\s*$/g, '')
    },
    
    /**
     * Parse the given _tokens_.
     *
     * @param  {array} tokens
     * @return {array}
     * @api private
     */
    
    parse: function(tokens) {
      var token, list = /^-(.*)/, key = /^([\w\-]+):/, stack = {}
      while (token = tokens.shift())
        if (token[0] == '#' || token == '---' || token == "\n") 
          continue
        else if (key.exec(token) && tokens[0] == "\n")
          stack[RegExp.$1] = this.parse(tokens)
        else if (key.exec(token))
          stack[RegExp.$1] = this.valueOf(tokens.shift())
        else if (list.exec(token))
          (stack.constructor == Array ?
            stack : (stack = [])).push(this.strip(RegExp.$1))
      return stack
    },
    
    /**
     * Evaluate the given YAML _str_.
     *
     * @param  {string} str
     * @return {hash}
     * @api public
     */
    
    eval: function(str) {
      return this.parse(this.tokenize(str))
    }
  }
})()
