
process.mixin(require('sys'))
require.paths.unshift('spec', './spec/lib/lib', 'lib')
require('jspec')
yaml = require('yaml')

JSpec
  .exec('spec/spec.core.js')
  .run({ reporter: JSpec.reporters.Terminal, fixturePath: 'spec/fixtures', failuresOnly: true })
  .report()
