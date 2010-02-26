
var path = process.argv[2],
    fs = require('fs'),
    sys = require('sys'),
    yaml = require('../lib/yaml')
    
if (!path)
  throw new Error('provide path to yaml file')

sys.puts('\n')
sys.puts(fs.readFileSync(path))
sys.puts('\noutputs:\n')
sys.p(yaml.eval(fs.readFileSync(path)))