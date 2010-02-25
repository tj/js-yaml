
describe 'YAML'
  describe '.strip()'
    it 'should strip leading / trailing whitespace'
      yaml.strip('foo   ').should.eql 'foo'
      yaml.strip('   foo').should.eql 'foo'
      yaml.strip('   foo   ').should.eql 'foo'
    end  
  end
  
  describe '.eval()'
    describe 'comments'
      it 'should be ignored when the entire line is a comment'
        yaml.eval('# enabled: true').should.eql {}
      end
      
      it 'should be ignored when following additional yaml'
        yaml.eval('enabled: true # Enable something').should.eql { enabled: true }
      end
    end
    
    describe 'integers'
      it 'should evaluate to integers'
        yaml.eval('n: 1').should.eql { n: 1 }
      end
    end
    
    describe 'floats'
      it 'should evaluate to floats'
        yaml.eval('n: 1.5').should.eql { n: 1.5 }
      end
    end
    
    describe 'strings'
      it 'should evaluate to literal strings when using double quotes'
        yaml.eval('foo: "bar\n"').should.eql { foo: "bar\n" }
      end
      
      it 'should evaluate to literal strings when using single quotes'
        yaml.eval("foo: 'bar'").should.eql { foo: 'bar' }
      end
    end
    
    describe 'booleans'
      describe 'true'
        it 'should evaluate to true'
          yaml.eval('foo: true').should.eql { foo: true }
        end
      end
      
      describe 'yes'
        it 'should evaluate to true'
          yaml.eval('foo: yes').should.eql { foo: true }
        end
      end
      
      describe 'on'
        it 'should evaluate to true'
          yaml.eval('foo: on').should.eql { foo: true }
        end
      end
      
      describe 'false'
        it 'should evaluate to false'
          yaml.eval('foo: false').should.eql { foo: false }
        end
      end
      
      describe 'off'
        it 'should evaluate to false'
          yaml.eval('foo: off').should.eql { foo: false }
        end
      end
      
      describe 'no'
        it 'should evaluate to false'
          yaml.eval('foo: no').should.eql { foo: false }
        end
      end
    end
    
    describe 'sequences'
      it 'should parse with one item'
        yml = '---        \n\
          specs:          \n\
            - foo.spec.js \n\
        '
        yaml.eval(yml).should.eql { specs: ['foo.spec.js'] }
      end
      
      it 'should parse with several items'
        yml = '---        \n\
          specs:          \n\
            - foo.spec.js \n\
            - bar.spec.js \n\
        '
        yaml.eval(yml).should.eql { specs: ['foo.spec.js', 'bar.spec.js'] }
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
        yaml.eval(yml).should.eql { one: ['a', 'b', 'c'], two: [1, 2] }
      end
      
      it 'should parse sequences of sequences'
        yml = '---                       \n\
          pages:                         \n\
            - [1, 2]                     \n\
            - [3, 4]                     \n\
        '
        yaml.eval(yml).should.eql { pages: [[1,2], [3,4]] }
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
        yaml.eval(yml).should.eql expected
      end
      
      it 'should parse inline sequences'
        yaml.eval('foo: [1, 2, 3]').should.eql { foo: [1,2,3] }
      end
    end
    
    describe 'maps'
      it 'should parse when only one is present'
        yaml.eval('foo: bar').should.eql { foo: "bar" }  
      end
      
      it 'should allow spaces in key ids'
        yaml.eval('foo bar: bar').should.eql { 'foo bar': "bar" }  
      end
      
      it 'should allow spaces before the semicolon'
        yaml.eval('foo: bar').should.eql { foo: "bar" }  
        yaml.eval('foo bar   : bar').should.eql { 'foo bar': "bar" }  
      end
      
      it 'should parse when several pairs are present'
        yml = '---        \n\
          boot: false     \n\
          enabled: true   \n\
        '
        yaml.eval(yml).should.eql { boot: false, enabled: true }
      end
      
      it 'should parse inline pairs'
        yaml.eval('foo: { n: 1 }').should.eql { foo: { n: 1 }}
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
        yaml.eval(yml).should.eql { boot: false, enabled: true, modules: ['panels', 'token'] }
      end
      
      it 'should parse sequences followed by maps'
        yml = '---        \n\
          modules:        \n\
            - panels      \n\
            - token       \n\
          boot: false     \n\
          enabled: true   \n\
        '
        yaml.eval(yml).should.eql { boot: false, enabled: true, modules: ['panels', 'token'] }
      end
      
      it 'should parse nested maps'
        yml = '---                   \n\
          environments:              \n\
            rhino:                   \n\
              options:               \n\
                failuresOnly: true   \n\
                verbose: false       \n\
        '
        expected = {
          environments: {
            rhino: {
              options: {
                failuresOnly: true,
                verbose: false
              }
            }
          }
        }
        yaml.eval(yml).should.eql expected
      end
      
      it 'should parse indentation based maps'
        yml = '---                   \n\
          environments:              \n\
            rhino:                   \n\
              options:               \n\
                failuresOnly: true   \n\
                verbose: false       \n\
            dom:                     \n\
              options:               \n\
                failuresOnly: false  \n\
        '                           
        expected = {
          environments: {
            rhino: {
              options: {
                failuresOnly: true,
                verbose: false
              }
            },
            dom: {
              options: {
                failuresOnly: false
              }
            }
          }
        }
        yaml.eval(yml).should.eql expected
      end
    end
  end
end