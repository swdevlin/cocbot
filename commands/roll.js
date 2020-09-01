const BaseCommand = require("./base");
const db = require('../db');
const {skillCheck} = require("../dieroller");

class Roll extends BaseCommand {
  constructor(prefix, msg) {
    super(prefix, msg);
    this.command = 'roll';
    this.skillName = null;
    this.score = null;
    this.bonusDice = 0;
    this.penaltyDice = 0;
    this.dieResult = null;
  }

  parseMsg() {
    const skillOrScore = this.commandText.substring(2);
    if (skillOrScore.length === 0)
      return;
    let score = parseInt(skillOrScore);
    if (Number.isNaN(score)) {
      this.skillName = skillOrScore;
    } else {
      this.score = score;
    }
  }

  setDieResult(score) {
    this.dieResult = skillCheck(
      score,
      this.bonusDice,
      this.penaltyDice
    );
  }

  async do() {
    await super.do();
    if (this.score === null && this.skillName === null) {
      await this.msg.reply('invalid format');
    } else if (this.score === null) {
      const sql = 'select score from investigator_skill where guild_id = $1 and user_id = $2 and skill_name = $3';
      const res = await db.query(
        sql,
        [this.guild.id, this.author.id, this.skillName]
      );
      if (res.rows.length > 0) {
        let score = res.rows[0].score;
        if (this.dieResult === null)
          this.setDieResult(score);
        await this.msg.reply(`**${this.dieResult.result}** (roll of ${this.dieResult.roll}) on a **${this.skillName}** check of ${score}`);
      } else {
        await this.msg.reply(`**${this.skillName}** is not a skill the investigator knows`);
      }
    } else {
      if (this.dieResult === null)
        this.setDieResult(this.score);
      await this.msg.reply(`**${this.dieResult.result}** (roll of ${this.dieResult.roll}) against a check of ${this.score}`);
    }
  }

}

Roll.command = 's';

module.exports = Roll;