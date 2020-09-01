const chai = require('chai');
chai.should();
const expect = chai.expect;
const sinon = require('sinon');

const db = require('../../db');
const GroupSkillCheck = require("../../commands/groupskillcheck");

describe('GroupSkillCheck', function () {

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

  it('should tell the user with the lowest luck to make a luck roll', async function () {
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
      content: 'coc group'
    };
    try {
      const command = new GroupSkillCheck('coc', msg);
      await command.do();
      expect(msg.reply.called).to.be.ok;
      const expectedText = '<@user3> please make a luck check';
      expect(msg.reply.calledWith(expectedText)).to.be.ok;
    } catch(err) {
      console.log(err);
      expect(false).to.be.ok;
    }
  });

  it('should say no luck registered if no luck', async function () {
    let msg = {
      author: {
        id: 'user1',
        send: sinon.stub().resolves('ok'),
      },
      channel: {
        guild: {
          id: 'test2'
        }
      },
      reply: sinon.stub().resolves('ok'),
      content: 'coc group'
    };
    try {
      const command = new GroupSkillCheck('coc', msg);
      await command.do();
      expect(msg.reply.called).to.be.ok;
      const expectedText = 'No investigator has a registered luck skill';
      expect(msg.reply.calledWith(expectedText)).to.be.ok;
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

