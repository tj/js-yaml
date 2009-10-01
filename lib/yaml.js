
;(function(){
  YAML = {
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
    
    tokenize: function(str) {
      return str.match(/(---|true|yes|on|false|no|off|null|#(.*)|\[(.*?)\]|\{(.*?)\}|[\w\-]+:|-(.+)|\d+\.\d+|\d+|\n+)/g)
    },
    
    strip: function(str) {
      return str.replace(/^\s*|\s*$/g, '')
    },
    
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
    
    eval: function(str) {
      return this.parse(this.tokenize(str))
    }
  }
})()
