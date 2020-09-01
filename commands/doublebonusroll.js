const BonusRoll = require("./bonusroll");

class DoubleBonusRoll extends BonusRoll {
  constructor(prefix, msg) {
    super(prefix, msg);
    this.command = 'roll';
    this.bonusDice = 2;
  }

}

DoubleBonusRoll.command = 'B';

module.exports = DoubleBonusRoll;