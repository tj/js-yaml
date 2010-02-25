
load('spec/lib/lib/jspec.js')
load('lib/yaml.js')

JSpec
.exec('spec/spec.core.js')
.run({ reporter: JSpec.reporters.Terminal })
.report()