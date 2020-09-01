const Roll = require("./roll");

class BonusRoll extends Roll {
  constructor(prefix, msg) {
    super(prefix, msg);
    this.command = 'roll';
    this.bonusDice = 1;
  }

}

BonusRoll.command = 'b';

module.exports = BonusRoll;