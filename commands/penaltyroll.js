const Roll = require("./roll");

class PenaltyRoll extends Roll {
  constructor(prefix, msg) {
    super(prefix, msg);
    this.command = 'roll';
    this.penaltyDice = 1;
  }

}

PenaltyRoll.command = 'p';

module.exports = PenaltyRoll;