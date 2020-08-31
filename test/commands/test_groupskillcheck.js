const path = require('path');

require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const chai = require('chai');
chai.should();

const {groupSkillCheck} = require("../../commands/groupskillcheck");

const db = require('../../db');

describe('group', function () {

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
      theReply: null,
      reply: function (text) {
        this.theReply = text;
      },
      channel: {
        guild: {
          id: 'test'
        }
      },
    };
    try {
      await groupSkillCheck(msg);
      msg.theReply.should.equal('<@user3> please make a luck check');
    } catch(err) {
      console.log(err);
    }
  });

  it('should say no luck registered if no luck', async function () {
    let msg = {
      theReply: null,
      reply: function (text) {
        this.theReply = text;
      },
      channel: {
        guild: {
          id: 'test2'
        }
      },
    };
    try {
      await groupSkillCheck(msg);
      msg.theReply.should.equal('No investigator has a registered luck skill');
    } catch(err) {
      console.log(err);
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

