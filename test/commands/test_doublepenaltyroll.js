const chai = require('chai');
chai.should();
const sinon = require('sinon');

const DoublePenaltyRoll = require("../../commands/doublepenaltyroll");

describe('TestDoublePenaltyRoll', function () {
  it('constructor should set penaltyDice to 2', function() {
    let msg = {
      author: {
        id: 'user1',
        send: sinon.stub().resolves('ok'),
      },
      channel: {
        guild: {
          id: 'test'
        }
      },
      reply: sinon.stub().resolves('ok'),
      content: 'coc P 80'
    };
    const command = new DoublePenaltyRoll('coc', msg)
    command.parseMsg();
    command.penaltyDice.should.be.equal(2);
    command.bonusDice.should.be.equal(0);
    command.score.should.be.equal(80);
  });
});

