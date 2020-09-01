const db = require('../db');
const BaseCommand = require("./base");

class MySkills extends BaseCommand {
  async do() {
    await super.do();
    const sql = 'select skill_name, score from investigator_skill where guild_id = $1 and user_id = $2 order by skill_name';
    const res = await db.query(
      sql,
      [this.guild.id, this.author.id]
    );
    if (res.rows.length > 0) {
      let skills = [];
      for (let {score, skill_name} of res.rows) {
        skills.push(`${skill_name} ${score}`);
      }
      await this.author.send(skills.join(', '));
    } else {
      await this.author.send('no skills registered');
    }

  }
}

MySkills.command = 'myskills';

module.exports = MySkills;
