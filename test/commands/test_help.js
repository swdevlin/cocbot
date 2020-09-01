const path = require('path');
const fs = require('fs');

require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const chai = require('chai');
const yaml = require("js-yaml");
chai.should();

const {cocBotHelp} = require("../../commands/help");

describe('help', function () {

  it('should list all the commands', async function () {
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
    const expected = commandList.join('\n');
    const command = {command: 'help', parameters: {}};
    try {
      const response = await cocBotHelp(command);
      response.should.equal(expected);
    } catch(err) {
      console.log(err);
    }
  });

});

