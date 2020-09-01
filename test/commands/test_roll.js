const chai = require('chai');
chai.should();
const expect = chai.expect;
const sinon = require('sinon');

const Roll = require("../../commands/roll");
const db = require('../../db');

describe('TestRoll', function () {

  before(async function () {
    const client = await db.getClient();
    try {
      const sql = 'insert into investigator_skill (guild_id, user_id, skill_name, score) values ($1, $2, $3, $4)';
      await client.query( sql, ['test', 'user1', 'luck', 40] );
      await client.query( sql, ['test', 'user2', 'luck', 50] );
      await client.query( sql, ['test', 'user3', 'luck', 38] );
      await client.query( sql, ['test', 'user4', 'luck', 70] );
    } catch (err) {
      console.log(err);
    } finally {
      client.release();
    }
  });

  it('constructor should set extra dice to 0', function() {
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
      content: 'coc s 67'
    };
    const command = new Roll('coc', msg)
    command.penaltyDice.should.be.equal(0);
    command.bonusDice.should.be.equal(0);
  });

  it('support skill number', function() {
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
      content: 'coc s 67'
    };
    const command = new Roll('coc', msg)
    command.parseMsg();
    command.score.should.be.equal(67);
    expect(command.skillName).to.be.null;
  });

  it('support skill name', function() {
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
      content: 'coc s stealth'
    };
    const command = new Roll('coc', msg)
    command.parseMsg();
    command.skillName.should.be.equal('stealth');
    expect(command.score).to.be.null;
  });

  it('sends error message if no skill or score', async function() {
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
      content: 'coc s'
    };
    const command = new Roll('coc', msg)
    await command.do();
    expect(msg.reply.called).to.be.ok;
    const expectedText = 'invalid format';
    expect(msg.reply.calledWith(expectedText)).to.be.ok;
  });

  it('score renders correctly', async function() {
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
      content: 'coc s 91'
    };
    const command = new Roll('coc', msg)
    command.dieResult = {
      roll: 32,
      result: 'success'
    };
    await command.do();
    expect(msg.reply.called).to.be.ok;
    const expectedText = '**success** (roll of 32) against a check of 91';
    expect(msg.reply.calledWith(expectedText)).to.be.ok;
  });

  it('skill renders correctly', async function() {
    let msg = {
      author: {
        id: 'user2',
        send: sinon.stub().resolves('ok'),
      },
      channel: {
        guild: {
          id: 'test'
        }
      },
      reply: sinon.stub().resolves('ok'),
      content: 'coc s luck'
    };
    const command = new Roll('coc', msg)
    command.dieResult = {
      roll: 32,
      result: 'success'
    };
    await command.do();
    expect(msg.reply.called).to.be.ok;
    const expectedText = '**success** (roll of 32) on a **luck** check of 50';
    expect(msg.reply.calledWith(expectedText)).to.be.ok;
  });

  it('setDieResults works', async function() {
    let msg = {
      author: {
        id: 'user2',
        send: sinon.stub().resolves('ok'),
      },
      channel: {
        guild: {
          id: 'test'
        }
      },
      reply: sinon.stub().resolves('ok'),
      content: 'coc s 65'
    };
    const command = new Roll('coc', msg)
    command.setDieResult(65);
    expect(command.dieResult).to.not.be.null;
  });

  it('setDieResults is called if score', async function() {
    let msg = {
      author: {
        id: 'user2',
        send: sinon.stub().resolves('ok'),
      },
      channel: {
        guild: {
          id: 'test'
        }
      },
      reply: sinon.stub().resolves('ok'),
      content: 'coc s 65'
    };
    const command = new Roll('coc', msg)
    await command.do();
    expect(command.dieResult).to.not.be.null;
  });

  it('setDieResults is called if skill', async function() {
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
      content: 'coc s luck'
    };
    const command = new Roll('coc', msg)
    await command.do();
    expect(command.dieResult).to.not.be.null;
  });

  it('error message if character has no skill', async function() {
    let msg = {
      author: {
        id: 'user2',
        send: sinon.stub().resolves('ok'),
      },
      channel: {
        guild: {
          id: 'test'
        }
      },
      reply: sinon.stub().resolves('ok'),
      content: 'coc s missing'
    };
    const command = new Roll('coc', msg)
    await command.do();
    expect(msg.reply.called).to.be.ok;
    const expectedText = '**missing** is not a skill the investigator knows';
    expect(msg.reply.calledWith(expectedText)).to.be.ok;
  });

  after(async function () {
    const sql = 'delete from investigator_skill where guild_id = $1';
    try {
      await db.query( sql, ['test'] );
    } catch(err) {
      console.log(err);
    }
  });
});

