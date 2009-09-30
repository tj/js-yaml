
describe 'YAML'
  describe '.eval()'
    it 'should ignore comments'
      yml = '---        \n\
        # enabled: true \n\
      '
      YAML.eval(yml).should.eql {}
    end
    
    describe 'should parse'
      it 'pairs'
        yml = '---        \n\
          enabled: true \n\
        '
        YAML.eval(yml).should.eql { enabled: true }
      end
      
      it 'lists'
        yml = '---        \n\
          specs:          \n\
            - foo.spec.js \n\
            - bar.spec.js \n\
        '
        YAML.eval(yml).should.eql { specs: ['foo.spec.js', 'bar.spec.js'] }
      end
      
      it 'several lists'
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
      
      it 'several pairs'
        yml = '---        \n\
          boot: false     \n\
          enabled: true   \n\
        '
        YAML.eval(yml).should.eql { boot: false, enabled: true }
      end
      
      it 'nested values'
        yml = '---        \n\
          foo:            \n\
            bar:          \n\
              baz: "yay"  \n\
        '
        YAML.eval(yml).should.eql { foo: { bar: { baz: "yay" }}}
      end
    end
  end
end