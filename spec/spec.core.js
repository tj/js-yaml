
describe 'yaml'
  describe '.version'
    it 'should be a triplet'
      yaml.version.should.match(/^\d+\.\d+\.\d+$/)
    end
  end
  
  describe '-'
    it 'should convert to an array'
      var doc = yaml.eval('- 1\n- 2\n- 3\n')
      doc.should.eql [1,2,3]
    end
  end
  
  describe '\d+'
    it 'should convert to a number'
      var doc = yaml.eval('1')
      doc.should.eql 1
    end
  end
end