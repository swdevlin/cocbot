const chai = require('chai');
chai.should();
const expect = chai.expect;
const sinon = require('sinon');

const SkillDefinition = require("../../commands/skilldefinition");
const {skillDefinitions} = require("../../skills");

describe('skillDefinition', function () {
  it('should find a match for stealth', async function () {
    let msg = {
      author: {
        id: 'user1',
      },
      channel: {
        guild: {
          id: 'test'
        }
      },
      content: 'coc stealth',
      reply: sinon.stub().resolves('ok')
    };
    try {
      const command = new SkillDefinition('coc', msg);
      await command.do();
      expect(msg.reply.called).to.be.ok;
      const expectedText = '**stealth** ' + skillDefinitions['stealth'];
      expect(msg.reply.calledWith(expectedText)).to.be.ok;
    } catch(err) {
      console.log(err);
      expect(false).to.be.ok;
    }
  });

  it('case should be insensitive', async function () {
    let msg = {
      author: {
        id: 'user1',
      },
      channel: {
        guild: {
          id: 'test'
        }
      },
      content: 'coc stEAlth',
      reply: sinon.stub().resolves('ok')
    };
    try {
      const command = new SkillDefinition('coc', msg);
      await command.do();
      expect(msg.reply.called).to.be.ok;
      const expectedText = '**stealth** ' + skillDefinitions['stealth'];
      expect(msg.reply.calledWith(expectedText)).to.be.ok;
    } catch(err) {
      console.log(err);
      expect(false).to.be.ok;
    }
  });

  it('error message if skill does not exist', async function () {
    let msg = {
      author: {
        id: 'user1',
        send: sinon.stub().resolves('ok')
      },
      channel: {
        guild: {
          id: 'test'
        }
      },
      content: 'coc missing',
      reply: sinon.stub().resolves('ok')
    };
    try {
      const command = new SkillDefinition('coc', msg);
      await command.do();
      expect(msg.author.send).to.be.ok;
      const expectedText = 'invalid command';
      expect(msg.author.send.calledWith(expectedText)).to.be.ok;
    } catch(err) {
      console.log(err);
      expect(false).to.be.ok;
    }
  });
});

