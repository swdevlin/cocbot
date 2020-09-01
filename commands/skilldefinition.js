const BaseCommand = require("./base");
const {skillDefinitions} = require("../skills");

class SkillDefinition extends BaseCommand {

  async do() {
    await super.do();
    if (this.commandText in skillDefinitions) {
      let response = skillDefinitions[this.commandText];
      response = `**${this.commandText}** ` + response;
      await this.msg.reply(response);
    } else {
      await this.msg.author.send('invalid command');
    }
  }

}

SkillDefinition.command = null;

module.exports = SkillDefinition;
