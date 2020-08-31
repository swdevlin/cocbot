const parseCommand = (prefix, postedText) => {
    let command = postedText.substring(prefix.length).trim().toLowerCase();
    const func = determineCommand(command);
    if (func)
        return func(command);
    else {
        return {
            command: null,
            parameters: {}
        };
    }
};

const setSkill = (postedText) => {
    let tokens = postedText.substring(4).toLowerCase().split(' ');
    let params;
    if (tokens.length === 1 && tokens[0] === '') {
        params = {
            skillName: null,
            score: null
        }
    } else if (tokens.length === 1) {
        params = {
            skillName: tokens[0],
            score: null
        }
    } else  {
        const score = parseInt(tokens.pop());
        params = {
            skillName: tokens.join(' '),
            score: Number.isNaN(score) ? null : score
        }
    }
    return {command: 'set', parameters: params};
};

const skills = (postedText) => {
    return {command: 'skills', parameters: {}};
};

const reload = (postedText) => {
    return {command: 'reload', parameters: {}};
};

const mySkills = (postedText) => {
    return {command: 'myskills', parameters: {}};
};

const determineCommand = (postedText) => {
    const lowerText = postedText.toLowerCase();
    if (lowerText.startsWith('set'))
        return setSkill;
    else if (lowerText.startsWith('skills'))
        return skills;
    else if (lowerText.startsWith('group luck'))
        return groupCheck;
    else if (lowerText.startsWith('reload'))
        return reload;
    else if (lowerText.startsWith('s '))
        return standardRoll;
    else if (lowerText.startsWith('b '))
        return bonusRoll;
    else if (lowerText.startsWith('p '))
        return penaltyRoll;
    else if (lowerText.startsWith('myskills'))
        return mySkills;
    else
        return null;
}

const standardRoll = (postedText) => {
    const skillOrScore = postedText.substring(2).toLowerCase();
    let score = parseInt(skillOrScore);
    let params;
    if (Number.isNaN(score)) {
        params = {skillName: skillOrScore, score: null, bonusDice: 0, penaltyDice: 0};
    } else {
        params = {skillName: null, score: score, bonusDice: 0, penaltyDice: 0};
    }
    return {command: 'roll', parameters: params};
}

const bonusRoll = (postedText) => {
    const bonusDice = postedText.substring(0,1) === 'b' ? 1 : 2;
    const skillOrScore = postedText.substring(2);
    let score = parseInt(skillOrScore);
    let params;
    if (Number.isNaN(score)) {
        params = {skillName: skillOrScore, score: null, bonusDice: bonusDice, penaltyDice: 0};
    } else {
        params = {skillName: null, score: score, bonusDice: bonusDice, penaltyDice: 0};
    }
    return {command: 'roll', parameters: params};
}

const penaltyRoll = (postedText) => {
    const penaltyDice = postedText.substring(0,1) === 'p' ? 1 : 2;
    const skillOrScore = postedText.substring(2);
    let score = parseInt(skillOrScore);
    let params;
    if (Number.isNaN(score)) {
        params = {skillName: skillOrScore, score: null, bonusDice: 0, penaltyDice: penaltyDice};
    } else {
        params = {skillName: null, score: score, bonusDice: 0, penaltyDice: penaltyDice};
    }
    return {command: 'roll', parameters: params};
}

const groupCheck = (postedText) => {
    // const skill = postedText.substring(6);
    return {command: 'group', parameters: {skillName: 'luck'}};
};


exports.parseCommand = parseCommand;
exports.setSkill = setSkill;
exports.skills = skills;
exports.groupCheck = groupCheck;
exports.determineCommand = determineCommand;
exports.standardRoll = standardRoll;
exports.bonusRoll = bonusRoll;
exports.penaltyRoll = penaltyRoll;
exports.reload = reload;
exports.mySkills = mySkills;
