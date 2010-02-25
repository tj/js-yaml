
describe 'yaml'
  // describe '.version'
  //   it 'should be a triplet'
  //     yaml.version.should.match(/^\d+\.\d+\.\d+$/)
  //   end
  // end
  
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
  
  // 
  // describe 'int'
  //   it 'should convert to a number'
  //     yaml.eval('1').should.equal 1
  //   end
  // end
  // 
  // describe 'float'
  //   it 'should convert to a number'
  //     yaml.eval('1.5').should.equal 1.5
  //   end
  // end
  // 
  // describe '"string"'
  //   it 'should convert to a string'
  //     var doc = yaml.eval('"foo"')
  //     doc.should.eql 'foo'
  //   end
  // end
  // 
  // describe '-'
  //   it 'should convert to an array'
  //     var doc = yaml.eval('- 1  \n- 2\n- 3\n')
  //     doc.should.eql [1,2,3]
  //   end
  //   
  //   it 'should support nesting lists'
  //     var doc = yaml.eval('-\n  - 1\n  - 2\n')
  //     doc.should.eql [[1,2]]
  //   end
  // end
  // 
  // describe 'key: val'
  //   it 'should convert to an object'
  //     var doc = yaml.eval('a: 1\nb:  2 \n')
  //     doc.should.eql { a: 1, b: 2 }
  //   end
  // end
  // 
  // describe '# foo'
  //   it 'should be ignored as a comment'
  //     yaml.eval('# foo').should.be_undefined
  //     yaml.eval('1 # foo').should.equal 1
  //   end
  // end
  // 
  // describe 'indentation'
  //   describe 'when invalid'
  //     it 'should throw an error'
  //       -{ yaml.eval(fixture('list.invalid.yml')) }.should.throw_error 'invalid indentation, got 3 instead of 2'
  //     end
  //   end
  // end
  // 
  // describe 'list with list'
  //   it 'should work'
  //     var expected = [[1,2,3,[4,5]]]
  //     yaml.eval(fixture('list.list.yml')).should.eql expected
  //   end
  // end
  
  describe 'list with lists'
    it 'should work'
      var expected = [[1,2], [3,4], [5]]
      yaml.eval(fixture('list.lists.yml')).should.eql expected
    end
  end
  // 
  // describe 'hash with list'
  //   it 'should work'
  //     var expected = { pets: ['niko', 'simon'] }
  //     yaml.eval(fixture('hash.list.yml')).should.eql expected
  //   end
  // end
  // 
  // describe 'hash with hash'
  //   it 'should work'
  //     var expected = { pets: { niko: 2, simon: 14 }}
  //     yaml.eval(fixture('hash.hash.yml')).should.eql expected
  //   end
  // end
end