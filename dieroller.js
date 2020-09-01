const Random = require("random-js").Random;
const random = new Random();

const computeResult = (score, roll) => {
  const hard = score / 2;
  const extreme = score / 5;
  if (roll === 1)
    return "Critical success";
  else if (roll === 100)
    return "Fumble";
  else if (roll <= extreme)
    return "Extreme success";
  else if (roll <= hard)
    return "Hard success";
  else if (roll <= score)
    return "Success";
  else if (score < 50 && roll > 95)
    return "Fumble";
  else
    return "Fail";
};

const bonusRoll = (rolls) => {
  return Math.min(...rolls);
};

const penaltyRoll = (rolls) => {
  return Math.max(...rolls);
};

const rolls = (bonusDice, penaltyDice) => {
  let rolls = [random.die(100)];
  let diff = Math.abs(bonusDice - penaltyDice);
  if (diff > 2)
    diff = 2;
  for (let i=0; i< diff; i++)
    rolls.push(random.die(100));
  return rolls;
};

const skillCheck = (score, bonus_dice, penalty_dice) => {
  let roll;
  let diceRolls = rolls(bonus_dice, penalty_dice);
  if (bonus_dice.length > penalty_dice.length)
    roll = bonusRoll(diceRolls);
  else if (bonus_dice.length < penalty_dice.length)
    roll = penaltyRoll(diceRolls);
  else
    roll = diceRolls[0];

  return {
    roll: roll,
    result: computeResult(score, roll)
  }
};

exports.bonusRoll = bonusRoll;
exports.penaltyRoll = penaltyRoll;
exports.rolls = rolls;
exports.computeResult = computeResult;
exports.skillCheck = skillCheck;
