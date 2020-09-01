const db = require('../db');

const setSkill = async (guildId, authorId, command) => {
  if (command.parameters.score === null) {
    return 'Skill must have an integer score';
  } else {
    const sql = 'insert into investigator_skill (guild_id, user_id, skill_name, score) values ($1,$2,$3,$4) on conflict (guild_id, user_id, skill_name) do update set score = $4';
    await db.query(
      sql,
      [guildId, authorId, command.parameters.skillName, command.parameters.score]
    );
    return `${command.parameters.skillName} set to ${command.parameters.score}`;
  }
};

exports.setSkill = setSkill;
