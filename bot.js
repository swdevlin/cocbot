// Run dotenv
require('dotenv').config();
const yaml = require('js-yaml');
const fs = require('fs');
const { Pool } = require('pg');
const databasePool = new Pool();
const {skillCheck} = require('./dieroller');

const Discord = require('discord.js');
const {cocBotHelp} = require("./commands/help");
const {setSkill} = require("./commands/setskill");
const {skillDefinition} = require("./commands/skilldefinition");
const {groupSkillCheck} = require("./commands/groupskillcheck");
const {mySkills} = require("./commands/myskills");
const {parseCommand} = require("./commandparser");
const discordClient = new Discord.Client();

let skillDefinitions = yaml.safeLoad(fs.readFileSync('skills.yaml', 'utf8'));
let skillNames = Object.keys(skillDefinitions);
skillNames.sort();
let skillList = skillNames.join(', ');

const prefix = process.env.COCBOT_PREFIX || 'coc';

discordClient.on('ready', () => {
    console.log(`Logged in as ${discordClient.user.tag}!`);
});

discordClient.on('message', async msg => {
    // ignore our own messages
    if (`${msg.author.username}#${msg.author.discriminator}` === discordClient.user.tag)
        return;

    if (!msg.content.startsWith(prefix))
        return;

    const {id: author_id} = msg.author;
    const {guild} = msg.channel;
    const {id: guild_id} = guild;
    try {
        const command = parseCommand(prefix, msg.content);
        if (command.command === 'set') {
            const response = await setSkill(guild_id, author_id, command);
            await msg.reply(response);
        } else if (command.command === 'help') {
            const response = await cocBotHelp(command);
            await msg.author.send(response);
        } else if (command.command === 'myskills') {
            await mySkills(msg);
        } else if (command.command === 'roll') {
            if (command.parameters.score === null && command.parameters.skillName === null) {
                await msg.reply('invalid format');
            } else if (command.parameters.score === null) {
                const sql = 'select score from investigator_skill where guild_id = $1 and user_id = $2 and skill_name = $3';
                const res = await databasePool.query(
                    sql,
                    [guild_id, author_id, command.parameters.skillName]
                );
                if (res.rows.length > 0) {
                    let score = res.rows[0].score;
                    const dieResult = skillCheck(
                        score,
                        command.parameters.bonusDice,
                        command.parameters.penaltyDice
                    );
                    await msg.reply(`**${dieResult.result}** (roll of ${dieResult.roll}) on a **${command.parameters.skillName}** check of ${score}`);
                } else {
                    await msg.reply(`**${command.parameters.skillName}** is not a skill the investigator knows`);
                }
            } else {
                const dieResult = skillCheck(
                    command.parameters.score,
                    command.parameters.bonusDice,
                    command.parameters.penaltyDice
                );
                await msg.reply(`**${dieResult.result}** (roll of ${dieResult.roll}) against a check of ${command.parameters.score}`);
            }
        } else if (command.command === 'group') {
            await groupSkillCheck(msg);
        } else if (command.command === 'skills') {
            await msg.reply(skillList);
        } else if (command.command === 'reload') {
            skillDefinitions = yaml.safeLoad(fs.readFileSync('skills.yaml', 'utf8'));
            skillNames = Object.keys(skillDefinitions);
            skillList = skillNames.join(', ');
            await msg.reply('skills refreshed');
        } else if (command.command === null) {
            await skillDefinition(msg, prefix, skillDefinitions);
        }
    } catch(err) {
        console.log(err);
        await msg.reply(err);
    } finally {
        console.log(`${guild_id} ${author_id} ${msg.content}`);
    }
});

discordClient.login(process.env.DISCORD_TOKEN);
