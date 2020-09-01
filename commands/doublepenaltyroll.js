const Roll = require("./roll");

class DoublePenaltyRoll extends Roll {
  constructor(prefix, msg) {
    super(prefix, msg);
    this.command = 'roll';
    this.penaltyDice = 2;
  }

}

DoublePenaltyRoll.command = 'P';

module.exports = DoublePenaltyRoll;