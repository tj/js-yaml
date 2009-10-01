
describe 'YAML'
  describe '.strip()'
    it 'should strip leading / trailing whitespace'
      YAML.strip('foo   ').should.be 'foo'
      YAML.strip('   foo').should.be 'foo'
      YAML.strip('   foo   ').should.be 'foo'
    end  
  end
  
  describe '.eval()'
    describe 'comments'
      it 'should be ignored when the entire line is a comment'
        YAML.eval('# enabled: true').should.eql {}
      end
      
      it 'should be ignored when following additional yaml'
        YAML.eval('enabled: true # Enable something').should.eql { enabled: true }
      end
    end
    
    describe 'integers'
      it 'should evaluate to integers'
        YAML.eval('n: 1').should.eql { n: 1 }
      end
    end
    
    describe 'floats'
      it 'should evaluate to floats'
        YAML.eval('n: 1.5').should.eql { n: 1.5 }
      end
    end
    
    it 'should parse inline lists'
      YAML.eval('specs: ["foo", "bar"]').should.eql { specs: ['foo', 'bar'] }
    end
    
    it 'should parse hashes'
      YAML.eval('specs: { foo: "bar" }').should.eql { specs: { foo: 'bar' }}
    end
    
    describe 'booleans'
      describe 'true'
        it 'should evaluate to true'
          YAML.eval('foo: true').should.eql { foo: true }
        end
      end
      
      describe 'false'
        it 'should evaluate to false'
          YAML.eval('foo: false').should.eql { foo: false }
        end
      end
    end
    
    describe 'sequences'
      it 'should parse with one item'
        yml = '---        \n\
          specs:          \n\
            - foo.spec.js \n\
        '
        YAML.eval(yml).should.eql { specs: ['foo.spec.js'] }
      end
      
      it 'should parse with several items'
        yml = '---        \n\
          specs:          \n\
            - foo.spec.js \n\
            - bar.spec.js \n\
        '
        YAML.eval(yml).should.eql { specs: ['foo.spec.js', 'bar.spec.js'] }
      end
      
      it 'should parse with several sequences'
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
      
      it 'should parse sequences of maps'
        yml = '---                       \n\
          pages:                         \n\
            -                            \n\
              name: Home                 \n\
              title: Welcome to our site \n\
            -                            \n\
              name: Contact              \n\
              title: Contact Us          \n\
        '
        expected = {
          pages: [
              { name: 'Home', title: 'Welcome to our site' },
              { name: 'Contact', title: 'Contact Us' }
            ]
        }
        YAML.eval(yml).should.eql expected
      end
    end
    
    describe 'pairs'
      it 'should parse when only one is present'
        YAML.eval('foo: bar').should.eql { foo: "bar" }  
      end
      
      it 'should parse when several pairs are present'
        yml = '---        \n\
          boot: false     \n\
          enabled: true   \n\
        '
        YAML.eval(yml).should.eql { boot: false, enabled: true }
      end
    end
    
    describe 'integration'
      it 'should parse maps followed by sequences'
        yml = '---        \n\
          boot: false     \n\
          enabled: true   \n\
          modules:        \n\
            - panels      \n\
            - token       \n\
        '
        YAML.eval(yml).should.eql { boot: false, enabled: true, modules: ['panels', 'token'] }
      end
      
      it 'should parse sequences followed by maps'
        yml = '---        \n\
          modules:        \n\
            - panels      \n\
            - token       \n\
          boot: false     \n\
          enabled: true   \n\
        '
        YAML.eval(yml).should.eql { boot: false, enabled: true, modules: ['panels', 'token'] }
      end
    end
  end
end