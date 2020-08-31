const db = require('../db');

const groupSkillCheck = async (msg) => {
  const guild_id = msg.channel.guild.id;
  const sql = 'select user_id, score from investigator_skill where guild_id = $1 and skill_name = $2 order by score limit 1';
  const res = await db.query(sql, [guild_id, 'luck']);
  if (res.rows.length > 0) {
    const {user_id} = res.rows[0];
    msg.reply(`<@${user_id}> please make a luck check`);
  }
  else {
    msg.reply('No investigator has a registered luck skill');
  }
};

exports.groupSkillCheck = groupSkillCheck;
