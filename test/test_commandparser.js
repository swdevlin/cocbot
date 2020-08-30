const chai = require('chai'),
    should = chai.should();
const {
    skills, setSkill,
    parseCommand, determineCommand,
    standardRoll, reload,
    groupCheck, bonusRoll,
    penaltyRoll, mySkills
} = require('../commandparser');

describe('Determine Command', function () {
    describe('check command mapping', function () {
        it('set skill command', function () {
            let res = determineCommand('set skill value');
            res.should.eql(setSkill);
        });

        it('skills command', function () {
            let res = determineCommand('skills');
            res.should.eql(skills);
        });

        it('myskills command', function () {
            let res = determineCommand('myskills');
            res.should.eql(mySkills);
        });

        it('reload command', function () {
            let res = determineCommand('reload');
            res.should.eql(reload);
        });

        it('group luck check', function () {
            let res = determineCommand('group luck');
            res.should.eql(groupCheck);
        });

        it('group any skill not supported', function () {
            let res = determineCommand('group stealth');
            (res === null).should.be.true
        });

        it('standard roll', function () {
            let res = determineCommand('s luck');
            res.should.eql(standardRoll);

            res = determineCommand('s 90');
            res.should.eql(standardRoll);
        });

        it('bonus roll', function () {
            let res = determineCommand('b luck');
            res.should.eql(bonusRoll);

            res = determineCommand('b 90');
            res.should.eql(bonusRoll);

            res = determineCommand('B luck');
            res.should.eql(bonusRoll);

            res = determineCommand('B 90');
            res.should.eql(bonusRoll);
        });

        it('penalty roll', function () {
            let res = determineCommand('p luck');
            res.should.eql(penaltyRoll);

            res = determineCommand('p 90');
            res.should.eql(penaltyRoll);

            res = determineCommand('P luck');
            res.should.eql(penaltyRoll);

            res = determineCommand('P 90');
            res.should.eql(penaltyRoll);
        });
    });
});

describe('Command parser', function () {
    describe('parseCommand()', function () {
        it('prefix is removed', function () {
            let res = parseCommand('%', '%skills');
            res.should.eql({command: 'skills', parameters: {}});
            res = parseCommand('coc', 'cocskills');
            res.should.eql({command: 'skills', parameters: {}});
        });

        it('convert to lower case', function () {
            let res = parseCommand('%', '%skILLs');
            res.should.eql({command: 'skills', parameters: {}});
        });

        it('can have space after prefix', function () {
            let res = parseCommand('%', '% skills  ');
            res.should.eql({command: 'skills', parameters: {}});
        });

        it('invalid command is set to null', function () {
            let res = parseCommand('%', '% kkllkl');
            res.should.eql({command: null, parameters: {}});
        });
    });

    describe('setSkill()', function () {
        it('skill and score', function () {
            let res = setSkill('set skill 90');
            res.should.eql({command: 'set', parameters: {skillName: 'skill', score: 90}});
        });

        it('score needs to be an integer', function () {
            let res = setSkill('set skill loop');
            res.should.eql({command: 'set', parameters: {skillName: 'skill', score: null}});
        });

        it('missing score is null', function () {
            let res = setSkill('set skill');
            res.should.eql({command: 'set', parameters: {skillName: 'skill', score: null}});
        });

        it('no parameters has both null', function () {
            let res = setSkill('set');
            res.should.eql({command: 'set', parameters: {skillName: null, score: null}});
        });
    });

    describe('reload()', function () {
        it('reload command', function () {
            let res = reload('reload');
            res.should.eql({command: 'reload', parameters: {}});
        });
    });


    describe('myskills()', function () {
        it('myskills command', function () {
            let res = mySkills('myskills');
            res.should.eql({command: 'myskills', parameters: {}});
        });
    });

    describe('skills()', function () {
        it('skills command', function () {
            let res = skills('skills');
            res.should.eql({command: 'skills', parameters: {}});
        });
    });

    describe('standardRoll()', function () {
        it('skill name no score', function () {
            let res = standardRoll('s skill');
            res.should.eql({
                command: 'roll',
                parameters: {
                    skillName: 'skill',
                    score: null,
                    bonusDice: 0,
                    penaltyDice: 0
                }
            });
        });

        it('score no skill name', function () {
            let res = standardRoll('s 52');
            res.should.eql({
                command: 'roll',
                parameters: {
                    skillName: null,
                    score: 52,
                    bonusDice: 0,
                    penaltyDice: 0
                }
            });
        });
    });

    describe('bonusRoll()', function () {
        it('skill name no score', function () {
            let res = bonusRoll('b skill');
            res.should.eql({
                command: 'roll',
                parameters: {
                    skillName: 'skill',
                    score: null,
                    bonusDice: 1,
                    penaltyDice: 0
                }
            });

            res = bonusRoll('B skill');
            res.should.eql({
                command: 'roll',
                parameters: {
                    skillName: 'skill',
                    score: null,
                    bonusDice: 2,
                    penaltyDice: 0
                }
            });
        });

        it('score no skill name', function () {
            let res = bonusRoll('b 52');
            res.should.eql({
                command: 'roll',
                parameters: {
                    skillName: null,
                    score: 52,
                    bonusDice: 1,
                    penaltyDice: 0
                }
            });

            res = bonusRoll('B 52');
            res.should.eql({
                command: 'roll',
                parameters: {
                    skillName: null,
                    score: 52,
                    bonusDice: 2,
                    penaltyDice: 0
                }
            });
        });
    });

    describe('penaltyRoll()', function () {
        it('skill name no score', function () {
            let res = penaltyRoll('p skill');
            res.should.eql({
                command: 'roll',
                parameters: {
                    skillName: 'skill',
                    score: null,
                    bonusDice: 0,
                    penaltyDice: 1
                }
            });

            res = penaltyRoll('P skill');
            res.should.eql({
                command: 'roll',
                parameters: {
                    skillName: 'skill',
                    score: null,
                    bonusDice: 0,
                    penaltyDice: 2
                }
            });
        });

        it('score no skill name', function () {
            let res = penaltyRoll('p 52');
            res.should.eql({
                command: 'roll',
                parameters: {
                    skillName: null,
                    score: 52,
                    bonusDice: 0,
                    penaltyDice: 1
                }
            });

            res = penaltyRoll('P 52');
            res.should.eql({
                command: 'roll',
                parameters: {
                    skillName: null,
                    score: 52,
                    bonusDice: 0,
                    penaltyDice: 2
                }
            });
        });
    });

    describe('group()', function () {
        it('group skill check', function () {
            let res = groupCheck('group luck');
            res.should.eql({
                command: 'group',
                parameters: {
                    skillName: 'luck'
                }
            });
        });
    });

});
