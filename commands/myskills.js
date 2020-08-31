const db = require('../db');

const mySkills = async ({author, channel}) => {
  const sql = 'select skill_name, score from investigator_skill where guild_id = $1 and user_id = $2 order by skill_name';
  const author_id = author.id;
  const guild_id = channel.guild.id;
  const res = await db.query(
    sql,
    [guild_id, author_id]
  );
  if (res.rows.length > 0) {
    let skills = [];
    for (let {score, skill_name} of res.rows) {
      skills.push(`${skill_name} ${score}`);
    }
    await author.send(skills.join(', '));
  } else {
    await author.send('no skills registered');
  }
};

exports.mySkills = mySkills;
