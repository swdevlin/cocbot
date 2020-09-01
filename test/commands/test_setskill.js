const path = require('path');

require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const chai = require('chai');
chai.should();

const {setSkill} = require("../../commands/setskill");

const db = require('../../db');

describe('setSkill', function () {

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

  it('should add a new skill', async function () {
    const command = {
      parameters: {skillName: 'test skill', score: 17}
    };
    try {
      const response = await setSkill('test', 'user1', command);
      response.should.equal('test skill set to 17');
      const sql = 'select 1 from investigator_skill where guild_id = $1 and user_id = $2 and skill_name = $3 and score = $4';
      try {
        const res = await db.query( sql, ['test', 'user1', 'test skill', 17] );
        (res.rows.length === 1).should.be.true;
      } catch(err) {
        console.log(err);
      }
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

