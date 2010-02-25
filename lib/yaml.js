
// YAML.js - Copyright TJ Holowaychuk <tj@vision-media.ca> (MIT Licensed)

YAML = {
  
  /**
   * Value of the given _token_.
   *
   * The following conversion are made, otherwise
   * the _token_ is passed to eval().
   *
   *   true  | yes | on  // => true
   *   false | no | off // => false
   *
   * @param {string} token
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
   * @param {string} str
   * @return {array}
   * @api private
   */
  
  tokenize: function(str) {
    return str.match(/(---|true|yes|on|false|no|off|null|#(.*)|\[(.*?)\]|\{(.*?)\}|[\w\-]+:|-(.+)|\d+\.\d+|\d+|\n+|"(.*?)"|'(.*?)')/g)
  },
  
  /**
   * Strip leading / trailing whitespace from _str_.
   *
   * @param {string} str
   * @return {string}
   * @api private
   */
  
  strip: function(str) {
    return str.replace(/^\s*|\s*$/g, '')
  },
  
  /**
   * Parse the given _tokens_.
   *
   * @param {array} tokens
   * @return {array}
   * @api private
   */
  
  parse: function(tokens) {
    var token, is_list = /^-(.*)/, is_key = /^([\w\-]+):/, stack = {};
    while (token = tokens.shift()) {
      if (token[0] == '#' || token == '---' || token == "\n") {
        continue;
      } else if (is_key.exec(token) && tokens[0] == "\n") {
        var key = RegExp.$1;
        var value = this.parse(tokens);
        stack[key] = value;
      } else if (is_key.exec(token)) {
        var key = RegExp.$1;
        var value = this.valueOf(tokens.shift());
        stack[key] = value;
      } else if (is_list.exec(token)) {
        var value = this.strip(RegExp.$1);
        (stack.constructor == Array ?
          stack : (stack = [])).push(value);
      }
    }
    return stack;
  },
  
  /**
   * Evaluate the given YAML _str_.
   *
   * @param {string} str
   * @return {hash}
   * @api public
   */
  
  eval: function(str) {
    return this.parse(this.tokenize(str))
  }
}
