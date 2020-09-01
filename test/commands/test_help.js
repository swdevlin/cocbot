const chai = require('chai');
chai.should();
const expect = chai.expect;
const sinon = require('sinon');


const Help = require("../../commands/help");

describe('help', function () {

  it('should list all the commands', async function () {
    const commandList = [
      '`skillname` : show help text for the skill',
      '**set** `skillname score` : set a skill for your character',
      '**s** `skillname` or `score` : standard skill check using saved skill or a score',
      '**b** `skillname` or `score` : bonus die skill check using saved skill or a score',
      '**B** `skillname` or `score` : two bonus dice skill check using saved skill or a score',
      '**p** `skillname` or `score` : penalty die skill check using saved skill or a score',
      '**P** `skillname` or `score` : two penalty dice skill check using saved skill or a score',
      '**help** : this command',
    ];
    const expectedHelp = commandList.join('\n');
    let msg = {
      author: {
        id: 'user1',
      },
      channel: {
        guild: {
          id: 'test'
        }
      },
      content: 'coc help',
      reply: sinon.stub().resolves('ok')
    };
    const help = new Help('coc', msg);
    try {
      await help.do();
      expect(msg.reply.called).to.be.ok;
      expect(msg.reply.calledWith(expectedHelp)).to.be.ok;
    } catch(err) {
      console.log(err);
      expect(false).to.be.ok;
    }
  });

});

