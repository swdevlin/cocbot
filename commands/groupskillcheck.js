const db = require('../db');
const BaseCommand = require("./base");

class GroupSkillCheck extends BaseCommand {
  constructor(prefix, msg) {
    super(prefix, msg);
    this.skillName = null;
  }


  parseMsg() {
    this.skillName = 'luck';
  }

  async do() {
    await super.do();
    const sql = 'select user_id, score from investigator_skill where guild_id = $1 and skill_name = $2 order by score limit 1';
    const res = await db.query(sql, [this.guild.id, 'luck']);
    if (res.rows.length > 0) {
      const {user_id} = res.rows[0];
      await this.msg.reply(`<@${user_id}> please make a luck check`);
    }
    else {
      await this.msg.reply('No investigator has a registered luck skill');
    }

  }
}

GroupSkillCheck.command = 'group';

module.exports = GroupSkillCheck;
