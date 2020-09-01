const chai = require('chai');
chai.should();
const sinon = require('sinon');

const DoubleBonusRoll = require("../../commands/doublebonusroll");

describe('TestDoubleBonusRoll', function () {
  it('constructor should set bonusDice to 2', function() {
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
      content: 'coc b 67'
    };
    const command = new DoubleBonusRoll('coc', msg)
    command.parseMsg();
    command.penaltyDice.should.be.equal(0);
    command.bonusDice.should.be.equal(2);
  });
});

