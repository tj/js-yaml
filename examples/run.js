
var path = process.argv[2],
    fs = require('fs'),
    yaml = require('../lib/yaml')
    
if (!path)
  throw new Error('provide path to yaml file')

console.log('\n')
console.log(fs.readFileSync(path).toString())
console.log('\noutputs:\n')
console.log(yaml.eval(fs.readFileSync(path).toString()))
