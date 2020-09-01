const chai = require('chai');
chai.should();
const expect = chai.expect;
const sinon = require('sinon');

const Skills = require("../../commands/skills");
const {skillList} = require("../../skills");

describe('skills', function () {

  it('should list all the skills', async function () {
    let msg = {
      author: {
        id: 'user1',
      },
      channel: {
        guild: {
          id: 'test'
        }
      },
      content: 'coc skills',
      reply: sinon.stub().resolves('ok')
    };
    const skills = new Skills('coc', msg);
    try {
      await skills.do();
      expect(msg.reply.called).to.be.ok;
      expect(msg.reply.calledWith(skillList)).to.be.ok;
    } catch(err) {
      console.log(err);
      expect(false).to.be.ok;
    }
  });

});

