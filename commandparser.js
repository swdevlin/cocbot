const commands = require('./commandcollection');
const SkillDefinition = require("./commands/skilldefinition");
const {skillDefinitions} = require("./skills");

const getCommandObject = (prefix, msg) => {
  const tokens = msg.content.substring(prefix.length).toLowerCase().trim().split(' ');
  if (tokens[0] === '')
    return null;
  const command = tokens[0];
  for (const cc in commands) {
    if (command === commands[cc].command) {
      return new commands[cc](prefix, msg);
    }
  }
  if (tokens.length === 1 && tokens[0] in skillDefinitions) {
    return new SkillDefinition(prefix, msg);
  }
  return null;
}

exports.getCommandObject = getCommandObject;
