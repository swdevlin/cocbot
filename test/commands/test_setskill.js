const chai = require('chai');
chai.should();
const expect = chai.expect;
const sinon = require('sinon');

const db = require('../../db');
const SetSkill = require("../../commands/setskill");

describe('SetSkill', function () {

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
      expect(false).to.be.ok;
    } finally {
      client.release();
    }
  });

  it('should parse have a blank score', function() {
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
      content: 'coc set test'
    };
    const command = new SetSkill('coc', msg)
    command.parseMsg();
    command.skillName.should.be.equal('test');
    expect(command.score).to.be.null;
  });

  it('should be blank if no skill is supplied', function() {
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
      content: 'coc set'
    };
    const command = new SetSkill('coc', msg)
    command.parseMsg();
    expect(command.score).to.be.null;
    expect(command.skillName).to.be.null;
  });

  it('should parse ok', function() {
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
      content: 'coc set test skill 17'
    };
    const command = new SetSkill('coc', msg)
    command.parseMsg();
    command.skillName.should.be.equal('test skill');
    command.score.should.be.equal(17);
  });

  it('should add a new skill', async function () {
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
      content: 'coc set test skill 17'
    };
    try {
      const command = new SetSkill('coc', msg)
      await command.do();
      expect(msg.reply.called).to.be.ok;
      const expectedText = 'test skill set to 17';
      expect(msg.reply.calledWith(expectedText)).to.be.ok;
      const sql = 'select 1 from investigator_skill where guild_id = $1 and user_id = $2 and skill_name = $3 and score = $4';
      const res = await db.query( sql, ['test', 'user1', 'test skill', 17] );
      (res.rows.length === 1).should.be.true;
    } catch(err) {
      console.log(err);
      expect(false).to.be.ok;
    }
  });

  it('should report an error if score is not a number', async function () {
    let msg = {
      author: {
        id: 'user5',
        send: sinon.stub().resolves('ok'),
      },
      channel: {
        guild: {
          id: 'test'
        }
      },
      reply: sinon.stub().resolves('ok'),
      content: 'coc set test number'
    };
    try {
      const command = new SetSkill('coc', msg)
      await command.do();
      expect(msg.reply.called).to.be.ok;
      const expectedText = 'Skill must have an integer score';
      expect(msg.reply.calledWith(expectedText)).to.be.ok;
      const sql = 'select 1 from investigator_skill where guild_id = $1 and user_id = $2 and skill_name = $3 and score = $4';
      const res = await db.query( sql, ['test', 'user5', 'test', 17] );
      (res.rows.length === 0).should.be.true;
    } catch(err) {
      console.log(err);
      expect(false).to.be.ok;
    }
  });

  it('should report an error if no score is supplied', async function () {
    let msg = {
      author: {
        id: 'user5',
        send: sinon.stub().resolves('ok'),
      },
      channel: {
        guild: {
          id: 'test'
        }
      },
      reply: sinon.stub().resolves('ok'),
      content: 'coc set test'
    };
    try {
      const command = new SetSkill('coc', msg)
      await command.do();
      expect(msg.reply.called).to.be.ok;
      const expectedText = 'Skill must have an integer score';
      expect(msg.reply.calledWith(expectedText)).to.be.ok;
      const sql = 'select 1 from investigator_skill where guild_id = $1 and user_id = $2 and skill_name = $3 and score = $4';
      const res = await db.query( sql, ['test', 'user5', 'test', 17] );
      (res.rows.length === 0).should.be.true;
    } catch(err) {
      console.log(err);
      expect(false).to.be.ok;
    }
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

