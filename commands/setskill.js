const db = require('../db');
const BaseCommand = require("./base");

class SetSkill extends BaseCommand {
  constructor(prefix, msg) {
    super(prefix, msg);
    this.skillName = null;
    this.score = null;
  }

  parseMsg() {
    let tokens = this.commandText.split(' ');
    // get rid of the set
    tokens.shift();
    if (tokens.length > 1 || (tokens.length === 1 && tokens[0] !== '')) {
      if (tokens.length === 1) {
        this.skillName = tokens[0];
      } else {
        const score = parseInt(tokens.pop());
        this.skillName = tokens.join(' ');
        this.score = Number.isNaN(score) ? null : score;
      }
    }
  }

  async do() {
    await super.do();
    if (this.score === null) {
      await this.msg.reply('Skill must have an integer score');
    } else {
      const sql = 'insert into investigator_skill (guild_id, user_id, skill_name, score) values ($1,$2,$3,$4) on conflict (guild_id, user_id, skill_name) do update set score = $4';
      await db.query(
        sql,
        [this.guild.id, this.author.id, this.skillName, this.score]
      );
      await this.msg.reply(`${this.skillName} set to ${this.score}`);
    }
  }
}

SetSkill.command = 'set';

module.exports = SetSkill;
