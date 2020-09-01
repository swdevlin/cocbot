const BaseCommand = require("./base");
const {skillList} = require("../skills");

class Skills extends BaseCommand {

  async do() {
    await super.do();
    await this.msg.reply(skillList);
  }
}

Skills.command = 'skills';

module.exports = Skills;
