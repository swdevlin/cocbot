const chai = require('chai');
chai.should();
const sinon = require('sinon');

const BonusRoll = require("../../commands/bonusroll");

describe('TestBonusRoll', function () {
  it('constructor should set bonusDice to 1', function() {
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
    const command = new BonusRoll('coc', msg)
    command.parseMsg();
    command.penaltyDice.should.be.equal(0);
    command.bonusDice.should.be.equal(1);
  });
});

