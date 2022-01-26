module.exports = {
    name: 'help',
    description: 'List bot commands',
    usage: '>help',
    run: async (Discord, client, msg, args) => {
        msg.channel.send({
            embeds: [
                new Discord.MessageEmbed()
                    .setAuthor({ name: client.user.tag, iconURL: client.user.displayAvatarURL() })
                    .setColor('RED')
                    .setTitle('Command List')
                    .setDescription(client.commands.map(c => `\`${c.name}\` | ${c.description}`).join('\n'))
                    .setFooter({ text: '>help (command) for more info' })
            ]
        })
    }
}