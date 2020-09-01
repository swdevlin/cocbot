const chai = require('chai');
chai.should();
const expect = chai.expect;
const sinon = require('sinon');

const db = require('../../db');

const MySkills = require("../../commands/myskills");

describe('MySkills', function () {

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
        send: sinon.stub().resolves('ok')
      },
      channel: {
        guild: {
          id: 'test'
        }
      },
      content: 'coc myskills'
    };
    try {
      const command = new MySkills('coc', msg)
      await command.do();
      expect(msg.author.send.called).to.be.ok;
      const expectedText = 'skill 1 40, skill 2 50, skill 4 70';
      expect(msg.author.send.calledWith(expectedText)).to.be.ok;
    } catch(err) {
      console.log(err);
      expect(false).to.be.ok;
    }
  });

  it('should send a private message with no skills if there are no skills', async function () {
    let msg = {
      author: {
        id: 'user4',
        send: sinon.stub().resolves('ok')
      },
      channel: {
        guild: {
          id: 'test'
        }
      },
      content: 'coc myskills'
    };
    try {
      const command = new MySkills('coc', msg)
      await command.do();
      expect(msg.author.send.called).to.be.ok;
      const expectedText = 'no skills registered';
      expect(msg.author.send.calledWith(expectedText)).to.be.ok;
    } catch(err) {
      console.log(err);
      expect(false).to.be.ok;
    }
  });

  it('should use user and guild when selecting skills', async function () {
    let msg = {
      author: {
        id: 'user1',
        send: sinon.stub().resolves('ok')
      },
      channel: {
        guild: {
          id: 'test2'
        }
      },
      content: 'coc myskills'
    };

    try {
      const command = new MySkills('coc', msg)
      await command.do();
      expect(msg.author.send.called).to.be.ok;
      const expectedText = 'no skills registered';
      expect(msg.author.send.calledWith(expectedText)).to.be.ok;
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

