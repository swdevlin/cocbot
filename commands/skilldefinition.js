const skillDefinition = async (msg, prefix, skillDefinitions) => {
  const text = msg.content.substring(prefix.length).trim().toLowerCase();
  if (text in skillDefinitions) {
    let response = skillDefinitions[text];
    response = `**${text}** ` + response;
    await msg.reply(response);
  } else {
    await msg.author.send('invalid command');
  }
};

exports.skillDefinition = skillDefinition;
