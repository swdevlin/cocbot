const BaseCommand = require("./base");

class Help extends BaseCommand {
  async do() {
    await super.do();
    const commandList = [
      '`skillname` : show help text for the skill',
      '**set** `skillname score` : set a skill for your character',
      '**s** `skillname` or `score` : standard skill check using saved skill or a score',
      '**b** `skillname` or `score` : bonus die skill check using saved skill or a score',
      '**B** `skillname` or `score` : two bonus dice skill check using saved skill or a score',
      '**p** `skillname` or `score` : penalty die skill check using saved skill or a score',
      '**P** `skillname` or `score` : two penalty dice skill check using saved skill or a score',
      '**help** : this command',
    ];
    const helpText = commandList.join('\n');
    this.msg.reply(helpText);
  }
}

Help.command = 'help';

module.exports = Help;
