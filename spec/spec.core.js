
describe 'YAML'
  describe '.strip()'
    it 'should strip leading / trailing whitespace'
      YAML.strip('foo   ').should.be 'foo'
      YAML.strip('   foo').should.be 'foo'
      YAML.strip('   foo   ').should.be 'foo'
    end  
  end
  
  describe '.eval()'
    it 'should ignore single-line comments'
      YAML.eval('# enabled: true').should.eql {}
    end
    
    it 'should parse pairs'
      YAML.eval('enabled: true').should.eql { enabled: true }
    end
    
    it 'should parse integers'
      YAML.eval('n: 1').should.eql { n: 1 }
    end
    
    it 'should parse floats'
      YAML.eval('n: 1.5').should.eql { n: 1.5 }
    end
    
    it 'should parse bools'
      YAML.eval('foo: true').should.eql { foo: true }
      YAML.eval('foo: false').should.eql { foo: false }
    end
    
    it 'should parse inline lists'
      YAML.eval('specs: ["foo", "bar"]').should.eql { specs: ['foo', 'bar'] }
    end
    
    it 'should parse hashes'
      YAML.eval('specs: { foo: "bar" }').should.eql { specs: { foo: 'bar' }}
    end
    
    it 'should parse lists'
      yml = '---        \n\
        specs:          \n\
          - foo.spec.js \n\
          - bar.spec.js \n\
      '
      YAML.eval(yml).should.eql { specs: ['foo.spec.js', 'bar.spec.js'] }
    end
    
    it 'should parse several lists'
      yml = '---        \n\
        one:            \n\
          - a           \n\
          - b           \n\
          - c           \n\
        two:            \n\
          - 1           \n\
          - 2           \n\
      '
      YAML.eval(yml).should.eql { one: ['a', 'b', 'c'], two: [1, 2] }
    end
    
    it 'should parse several pairs'
      yml = '---        \n\
        boot: false     \n\
        enabled: true   \n\
      '
      YAML.eval(yml).should.eql { boot: false, enabled: true }
    end
    
    it 'should parse nested values'
      yml = '---        \n\
        foo:            \n\
          bar:          \n\
            baz: "yay"  \n\
      '
      YAML.eval(yml).should.eql { foo: { bar: { baz: "yay" }}}
    end
  end
end