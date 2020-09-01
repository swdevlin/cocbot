const chai = require('chai');
chai.should();
const expect = chai.expect;

const {
  getCommandObject
} = require('../commandparser');

describe('getCommandObject', function () {
  it('finds roll', function () {
    let msg = {
      author: {
        id: 'user1',
      },
      channel: {
        guild: {
          id: 'test'
        }
      },
      content: 'coc s 90'
    };

    let obj = getCommandObject('coc', msg);
    obj.constructor.name.should.equal('Roll');
  });

  it('finds set', function () {
    let msg = {
      author: {
        id: 'user1',
      },
      channel: {
        guild: {
          id: 'test'
        }
      },
      content: 'coc set stealth 90'
    };

    let obj = getCommandObject('coc', msg);
    obj.constructor.name.should.equal('SetSkill');
  });

  it('should return null if no command', function () {
    let msg = {
      author: {
        id: 'user1',
      },
      channel: {
        guild: {
          id: 'test'
        }
      },
      content: 'coc'
    };

    let obj = getCommandObject('coc', msg);
    expect(obj).to.be.null;
  });

  it('should return null if bad command', function () {
    let msg = {
      author: {
        id: 'user1',
      },
      channel: {
        guild: {
          id: 'test'
        }
      },
      content: 'coc HHJHJH'
    };

    let obj = getCommandObject('coc', msg);
    expect(obj).to.be.null;
  });

  it('should ignore case', function () {
    let msg = {
      author: {
        id: 'user1',
      },
      channel: {
        guild: {
          id: 'test'
        }
      },
      content: 'coc SeT stealth 65'
    };

    let obj = getCommandObject('coc', msg);
    expect(obj.constructor.name).to.equal('SetSkill');
  });

  it('finds skill match', function () {
    let msg = {
      author: {
        id: 'user1',
      },
      channel: {
        guild: {
          id: 'test'
        }
      },
      content: 'coc stealth'
    };

    let obj = getCommandObject('coc', msg);
    expect(obj.constructor.name).to.equal('SkillDefinition');
  });
});
