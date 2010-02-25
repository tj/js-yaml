
describe 'yaml'
  describe '.version'
    it 'should be a triplet'
      yaml.version.should.match(/^\d+\.\d+\.\d+$/)
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
  
  describe '-'
    it 'should convert to an array'
      var doc = yaml.eval('- 1  \n- 2\n- 3\n')
      doc.should.eql [1,2,3]
    end
  end
  
  describe 'key: val'
    it 'should convert to an object'
      var doc = yaml.eval('a: 1\nb:  2 \n')
      doc.should.eql { a: 1, b: 2 }
    end
  end
  
  describe '# foo'
    it 'should be ignored as a comment'
      yaml.eval('# foo').should.be_undefined
      yaml.eval('1 # foo').should.equal 1
    end
  end
  
  describe 'hash with list'
    it 'should work'
      var expected = { pets: ['niko', 'simon'] }
      yaml.eval(fixture('hash.list.yml')).should.eql expected
    end
  end
  
  describe 'hash with hash'
    it 'should work'
      var expected = { pets: { niko: 2, simon: 14 }}
      yaml.eval(fixture('hash.hash.yml')).should.eql expected
    end
  end
end