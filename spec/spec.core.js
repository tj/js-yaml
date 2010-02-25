
describe 'yaml'
  describe '.version'
    it 'should be a triplet'
      yaml.version.should.match(/^\d+\.\d+\.\d+$/)
    end
  end
end