const path = require('path');

require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const chai = require('chai');
chai.should();

const {mySkills} = require("../../commands/myskills");

const db = require('../../db');

describe('mySkills', function () {

  before(async function () {
    const client = await db.getClient();
    try {
      const sql = 'insert into investigator_skill (guild_id, user_id, skill_name, score) values ($1, $2, $3, $4)';
      await client.query( sql, ['test', 'user1', 'skill 1', 40] );
      await client.query( sql, ['test', 'user1', 'skill 2', 50] );
      await client.query( sql, ['test', 'user2', 'skill 2', 60] );
      await client.query( sql, ['test', 'user1', 'skill 4', 70] );
    } catch (err) {
      console.log(err);
    } finally {
      client.release();
    }
  });

  it('should send a private message with the list of skills', async function () {
    let msg = {
      author: {
        id: 'user1',
        send: function (text) {
          this.sendText = text;
        },
        sendText: null,
      },
      channel: {
        guild: {
          id: 'test'
        }
      },
    };
    try {
      await mySkills(msg);
      msg.author.sendText.should.equal('skill 1 40, skill 2 50, skill 4 70');
    } catch(err) {
      console.log(err);
    }
  });

  it('should send a private message with no skills if there are no skills', async function () {
    let msg = {
      author: {
        id: 'user4',
        send: function (text) {
          this.sendText = text;
        },
        sendText: null,
      },
      channel: {
        guild: {
          id: 'test'
        }
      },
    };
    try {
      await mySkills(msg);
      msg.author.sendText.should.equal('no skills registered');
    } catch(err) {
      console.log(err);
    }
  });

  it('should use user and guild when selecting skills', async function () {
    let msg = {
      author: {
        id: 'user1',
        send: function (text) {
          this.sendText = text;
        },
        sendText: null,
      },
      channel: {
        guild: {
          id: 'test2'
        }
      },
    };
    try {
      await mySkills(msg);
      msg.author.sendText.should.equal('no skills registered');
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

