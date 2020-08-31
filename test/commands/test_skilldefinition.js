const path = require('path');
const fs = require('fs');

require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const chai = require('chai');
const yaml = require("js-yaml");
chai.should();

const {skillDefinition} = require("../../commands/skilldefinition");

let skillDefinitions;

describe('skillDefinition', function () {

  before(async function () {
    const skillsFile = path.resolve(__dirname, '../../skills.yaml')
    try {
      skillDefinitions = yaml.safeLoad(fs.readFileSync(skillsFile, 'utf8'));
    } catch (err) {
      console.log(err);
    }
  });

  it('should find a match for stealth', async function () {
    let msg = {
      content: 'coc stealth',
      replyText: null,
      reply: function(text) {
        this.replyText = text;
      }
    };
    try {
      await skillDefinition(msg, 'coc', skillDefinitions);
      msg.replyText.should.equal('**stealth** ' + skillDefinitions['stealth']);
    } catch(err) {
      console.log(err);
    }
  });

  it('case should be insensitive', async function () {
    let msg = {
      content: 'coc stEAlth',
      replyText: null,
      reply: function(text) {
        this.replyText = text;
      }
    };
    try {
      await skillDefinition(msg, 'coc', skillDefinitions);
      msg.replyText.should.equal('**stealth** ' + skillDefinitions['stealth']);
    } catch(err) {
      console.log(err);
    }
  });

  it('should tell the user the command is invalid if there is no matching skill', async function () {
    let msg = {
      author: {
        id: 'user1',
        send: function (text) {
          this.sendText = text;
        },
        sendText: null,
      },
      content: 'coc noskill',
      replyText: null,
      reply: function(text) {
        this.replyText = text;
      }
    };
    try {
      await skillDefinition(msg, 'coc', skillDefinitions);
      msg.author.sendText.should.equal('invalid command');
    } catch(err) {
      console.log(err);
    }
  });

  after(async function () {
    // nothing to do
  });
});

