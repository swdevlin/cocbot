const db = require('../db');

const mySkills = async (msg) => {
  const sql = 'select skill_name, score from investigator_skill where guild_id = $1 and user_id = $2 order by skill_name';
  const author_id = msg.author.id;
  const guild_id = msg.channel.guild.id;
  const res = await db.query(
    sql,
    [guild_id, author_id]
  );
  if (res.rows.length > 0) {
    let skills = [];
    for (let skill of res.rows) {
      skills.push(`${skill.skill_name} ${skill.score}`);
    }
    msg.author.send(skills.join(', '));
  } else {
    msg.author.send('no skills registered');
  }
};

exports.mySkills = mySkills;
