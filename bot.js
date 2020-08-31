// Run dotenv
require('dotenv').config();
const yaml = require('js-yaml');
const fs = require('fs');
const { Pool } = require('pg');
const databasePool = new Pool();
const {skillCheck} = require('./dieroller');

const Discord = require('discord.js');
const {mySkills} = require("./commands/myskills");
const {parseCommand} = require("./commandparser");
const discordClient = new Discord.Client();

let skillDefinitions = yaml.safeLoad(fs.readFileSync('skills.yaml', 'utf8'));
let skillNames = Object.keys(skillDefinitions);
skillNames.sort();
let skillList = skillNames.join(', ');

const prefix = 'coc';

discordClient.on('ready', () => {
    console.log(`Logged in as ${discordClient.user.tag}!`);
});

discordClient.on('message', async msg => {
    // ignore our own messages
    if (msg.author.username + '#' + msg.author.discriminator === discordClient.user.tag)
        return;

    if (!msg.content.startsWith(prefix))
        return;

    try {
        const author_id = msg.author.id;
        const guild_id = msg.channel.guild.id;
        const command = parseCommand(prefix, msg.content);
        if (command.command === 'set') {
            if (command.parameters.score === null) {
                msg.reply('Skill must have an integer score');
            } else {
                const sql = 'insert into investigator_skill (guild_id, user_id, skill_name, score) values ($1,$2,$3,$4) on conflict (guild_id, user_id, skill_name) do update set score = $4';
                const res = await databasePool.query(
                    sql,
                    [guild_id, author_id, command.parameters.skillName, command.parameters.score]
                );
                msg.reply(`${command.parameters.skillName} set to ${command.parameters.score}`);
            }
        } else if (command.command === 'myskills') {
            try {
                mySkills(msg);
            } catch(err) {
                console.log(err);
            }
        } else if (command.command === 'roll') {
            if (command.parameters.score === null && command.parameters.skillName === null) {
                msg.reply('invalid format');
            } else if (command.parameters.score === null) {
                const sql = 'select score from investigator_skill where guild_id = $1 and user_id = $2 and skill_name = $3';
                const res = await databasePool.query(
                    sql,
                    [guild_id, author_id, command.parameters.skillName]
                );
                if (res.rows.length > 0) {
                    score = res.rows[0].score;
                    const dieResult = skillCheck(
                        score,
                        command.parameters.bonusDice,
                        command.parameters.penaltyDice
                    );
                    msg.reply(`**${dieResult.result}** (roll of ${dieResult.roll}) on a **${command.parameters.skillName}** check of ${score}`);
                } else {
                    msg.reply(`**${command.parameters.skillName}** is not a skill the investigator knows`);
                }
            } else {
                const dieResult = skillCheck(
                    command.parameters.score,
                    command.parameters.bonusDice,
                    command.parameters.penaltyDice
                );
                msg.reply(`**${dieResult.result}** (roll of ${dieResult.roll}) against a check of ${command.parameters.score}`);
            }
        } else if (command.command === 'group') {
            const sql = 'select user_id, score from investigator_skill where guild_id = $1 and skill_name = $2 order by score limit 1';
            const res = await databasePool.query(sql, [guild_id, 'luck']);
            if (res.rows.length > 0)
                msg.reply(`<@${res.rows[0].user_id}> please make a luck check`);
            else
                msg.reply('No luck skills registered');
        } else if (command.command === 'skills') {
            msg.reply(skillList);
        } else if (command.command === 'reload') {
            skillDefinitions = yaml.safeLoad(fs.readFileSync('skills.yaml', 'utf8'));
            skillNames = Object.keys(skillDefinitions);
            skillList = skillNames.join(', ');
            msg.reply('skills refreshed');
        } else if (command.command === null) {
            const text = msg.content.substring(prefix.length).trim()
            if (text in skillDefinitions) {
                let response = skillDefinitions[text];
                response = `**${text}** ` + response;
                msg.reply(response);
            } else {
                msg.author.send('invalid command');
            }
        }
    } catch(err) {
        console.log(err);
        msg.reply(err);
    }
});

discordClient.login(process.env.DISCORD_TOKEN);
