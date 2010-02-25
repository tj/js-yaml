
describe 'yaml'
  before
    assert = function(path, expected) {
      yaml.eval(fixture(path + '.yml')).should.eql expected
    }
  end
  
  describe '.version'
    it 'should be a triplet'
      yaml.version.should.match(/^\d+\.\d+\.\d+$/)
    end
  end
  
  describe 'lexer'
    describe 'indentation'
      it 'should work'
        var tokens = yaml.tokenize('\n  1\n  2\n    3\n      4\n')
        tokens[0][0].should.eql 'indent'
        tokens[1][0].should.eql 'int'
        tokens[2][0].should.eql 'int'
        tokens[3][0].should.eql 'indent'
        tokens[4][0].should.eql 'int'
        tokens[5][0].should.eql 'indent'
        tokens[6][0].should.eql 'int'
        tokens[7][0].should.eql 'dedent'
        tokens[8][0].should.eql 'dedent'
        tokens[9][0].should.eql 'dedent'
      end
    end
  end
  
  
  describe 'int'
    it 'should convert to a number'
      yaml.eval('1').should.equal 1
    end
  end
  
  describe 'float'
    it 'should convert to a number'
      yaml.eval('1.5').should.equal 1.5
    end
  end
  
  describe '"string"'
    it 'should convert to a string'
      var doc = yaml.eval('"foo"')
      doc.should.eql 'foo'
    end
  end
  
  describe '# foo'
    it 'should be ignored as a comment'
      yaml.eval('# foo').should.be_undefined
      yaml.eval('1 # foo').should.equal 1
    end
  end
  
  describe 'indentation'
    describe 'when invalid'
      it 'should throw an error'
        -{ yaml.eval(fixture('list.invalid.yml')) }.should.throw_error 'invalid indentation, got 3 instead of 2'
      end
    end
  end
  
  
  describe 'list'
    it 'should work'
      assert('list', [1,2,3])  
    end
    
    describe 'with nested list'
      it 'should work'
        assert('list.list', [[1,2,3,[4,5]]])
      end
    end
    
    describe 'with nested lists'
      it 'should work'
        assert('list.lists', [[1,2], [3,4, [5]]])
      end
    end
  end
  
  describe 'hash'
    it 'should work'
      assert('hash', { a: 1, b: 2 })
    end
    
    describe 'with nested list'
      it 'should work'
        assert('hash.list', { pets: ['niko', 'simon'] })
      end
    end
    
    describe 'with nested hash'
      it 'should work'
        assert('hash.hash', { pets: { niko: 2, simon: 14 }})
      end
    end
  end

end