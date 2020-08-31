const chai = require('chai');
chai.should();

const {skillCheck, computeResult, penaltyRoll, bonusRoll, rolls} = require('../dieroller');

describe('Die roller', function () {
    describe('computeResult()', function () {
        it('roll greater than score should return Fail', function () {
            let res = computeResult(60, 62);
            res.should.equal('Fail');
        });

        it('roll equal to score should return Succeed', function () {
            let res = computeResult(60, 60);
            res.should.equal('Success');
        });

        it('roll less than score should return Succeed', function () {
            let res = computeResult(60, 58);
            res.should.equal('Success');
        });

        it('roll less than score/2 should return Hard success', function () {
            let res = computeResult(60, 28);
            res.should.equal('Hard success');
        });

        it('roll equal to score/2 should return Hard success', function () {
            let res = computeResult(60, 30);
            res.should.equal('Hard success');
        });

        it('roll less than score/5 should return Extreme success', function () {
            let res = computeResult(60, 11);
            res.should.equal('Extreme success');
        });

        it('roll equal to score/5 should return Extreme success', function () {
            let res = computeResult(60, 12);
            res.should.equal('Extreme success');
        });

        it('a roll of 1 is a critical success', function () {
            let res = computeResult(60, 1);
            res.should.equal('Critical success');
        });

        it('a roll of 100 is a fumble', function () {
            let res = computeResult(60, 100);
            res.should.equal('Fumble');
        });

        it('a roll of 100 is a fumble even with a skill of 100', function () {
            let res = computeResult(100, 100);
            res.should.equal('Fumble');
        });

        it('96+ is a fumble if skill is < 50', function () {
            let res = computeResult(49, 96);
            res.should.equal('Fumble');
        });

        it('96-99 is a fail if skill is >= 50', function () {
            let res = computeResult(50, 96);
            res.should.equal('Fail');
        });
    });

    describe('penaltyRoll()', function () {
        it('penaltyRoll uses the highest roll', function () {
            let res = penaltyRoll([54,6,89,54]);
            res.should.equal(89);
        });
    });

    describe('bonusRoll()', function () {
        it('bonusRoll uses the lowest roll', function () {
            let res = bonusRoll([54,6,89,54]);
            res.should.equal(6);
        });
    });

    describe('rolls()', function () {
        it('one extra roll per bonus die', function () {
            let res = rolls(0, 0);
            res.should.have.lengthOf(1);

            res = rolls(2, 0);
            res.should.have.lengthOf(3);
        });

        it('one extra roll per penalty die', function () {
            res = rolls(0, 2);
            res.should.have.lengthOf(3);

            res = rolls(0, 1);
            res.should.have.lengthOf(2);
        });

        it('penalty dice cancel out bonus dice', function () {
            res = rolls(3, 2);
            res.should.have.lengthOf(2);

            res = rolls(3, 4);
            res.should.have.lengthOf(2);
        });

        it('max of 2 bonus dice', function () {
            res = rolls(4, 1);
            res.should.have.lengthOf(3);

            res = rolls(1, 4);
            res.should.have.lengthOf(3);
        });
    });
});
