
;(function(){
  YAML = {
    valueOf: function(token) {
      return eval('(' + token + ')')
    },
    
    tokenize: function(str) {
      return str.match(/(---|true|false|null|#(.*)|\[(.*?)\]|\{(.*?)\}|[\w\-]+:|-(.+)|\d+\.\d+|\d+|\n+)/g)
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
