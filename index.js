const Discord = require('discord.js');
require('dotenv').config();
const client = new Discord.Client({
    intents: [
        Object.keys(Discord.Intents.FLAGS).filter(f => f.startsWith('GUILD'))
    ]
});

client.cooldowns = new Map();
client.queue = new Map();
client.commands = new Discord.Collection();

['commands', 'event'].forEach(handler => {
    require(`./handlers/${handler}`)(client, Discord)
})

client.login(process.env.TOKEN)