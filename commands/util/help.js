const jaro = require('jaro-winkler');

module.exports = {
    name: 'help',
    description: 'List bot commands',
    usage: '>help',
    run: async (Discord, client, msg, args) => {
        if (!args.length) return msg.channel.send({
            embeds: [
                new Discord.MessageEmbed()
                    .setAuthor({ name: client.user.tag, iconURL: client.user.displayAvatarURL() })
                    .setColor('RED')
                    .setTitle('Command List')
                    .setDescription(client.commands.map(c => `\`${c.name}\` | ${c.description}`).join('\n'))
                    .setFooter({ text: '>help (command) for more info' })
            ]
        });
        let cmd = client.commands.get(args[0]) || client.commands.find(a => a.aliases?.includes(args[0]));
        if (!cmd) {
            let match = [];
            client.commands.forEach(c => match.push({ cmd: c.name, match: jaro(args[0], c.name) }))
            match.sort((a, b) => {
                if (a.match < b.match) {
                    return 1;
                } else if (a.match > b.match) {
                    return -1;
                } else {
                    return 0;
                }
            })
            return msg.channel.send(`Command not found: \`${args[0]}\`\nDid you mean: \`${match[0].cmd}\``)
        } else {
            return msg.channel.send({
                embeds: [
                    new Discord.MessageEmbed()
                        .setAuthor({ name: client.user.tag, iconURL: client.user.displayAvatarURL() })
                        .setColor('RED')
                        .setTitle(cmd.name[0].toUpperCase() + cmd.name.slice(1))
                        .setDescription(`**Description:** ${cmd.description ?? 'No Description'}\n**Usage:** ${cmd.usage ?? 'No Usage'}\n**Aliases:** ${cmd.aliases.length ? cmd.aliases.join(', ') : 'No Aliases'}`)
                        .setFooter({ text: "Arguments: () = Optional; [] = Required" })
                ]
            })
        }
    }
}