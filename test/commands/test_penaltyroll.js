const chai = require('chai');
chai.should();
const sinon = require('sinon');

const PenaltyRoll = require("../../commands/penaltyroll");

describe('TestPenaltyRoll', function () {
  it('constructor should set penaltyDice to 1', function() {
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
      content: 'coc p 80'
    };
    const command = new PenaltyRoll('coc', msg)
    command.parseMsg();
    command.penaltyDice.should.be.equal(1);
    command.bonusDice.should.be.equal(0);
  });
});

