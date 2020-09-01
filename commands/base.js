class BaseCommand {
  constructor(prefix, msg) {
    this.msg = msg;
    this.guild = msg.channel.guild;
    this.author = msg.author;
    this.prefix = prefix;
    this.commandText = this.msg.content.substring(prefix.length).toLowerCase().trim();
  }

  parseMsg() {

  }

  async do() {
    this.parseMsg();
  }
}

module.exports = BaseCommand;