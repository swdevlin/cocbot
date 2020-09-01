const yaml = require("js-yaml");
const fs = require('fs');

const skillDefinitions = yaml.safeLoad(fs.readFileSync('skills.yaml', 'utf8'));
const skillNames = Object.keys(skillDefinitions).sort();
const skillList = skillNames.join(', ');

module.exports.skillDefinitions = skillDefinitions;
module.exports.skillNames = skillNames;
module.exports.skillList = skillList;