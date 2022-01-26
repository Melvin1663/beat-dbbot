module.exports = {
    name: 'volume',
    description: 'Sets the volume of the bot',
    aliases: ['v'],
    usage: '>volume (volume)',
    run: async (Discord, client, msg, args) => {
        let channel = msg.member.voice.channel;
        if (!channel) return msg.reply('You need to be in a voice channel');
        var q = client.queue.get(msg.guild.id);
        if (q && msg.member.voice.channel.id !== msg.guild.me.voice.channel.id) return msg.channel.send(`You need to be in <#${msg.guild.me.voice.channel.id}>`)
        if (!q || !q.connection || !q.songs.length) return msg.channel.send("There's no Songs in the queue");
        if (!args.length) return msg.channel.send({
            embeds: [
                new Discord.MessageEmbed()
                    .setDescription({ text: `🎧 Volume: **${Math.trunc(q.volume * 100)}**/200` })
                    .setAuthor("Server Volume Manager", 'https://i.imgur.com/5I8C0jo.gif')
                    .setColor("GREEN")
            ]
        })
        if (parseInt(args[0]) < 0 || parseInt(args[0]) > 200) return msg.channel.send("You can only set the volume between 0 - 200");

        q.volume = parseInt(args[0]) / 100;
        q.connection.state.subscription.player.state.resource.volume.setVolume(q.volume);
        msg.channel.send({
            embeds: [
                new Discord.MessageEmbed()
                    .setDescription(`🎧 Volume: **${Math.trunc(q.volume * 100)}**/200`)
                    .setAuthor({ name: "Server Volume Manager", iconURL: 'https://i.imgur.com/5I8C0jo.gif' })
                    .setColor("BLUE")
            ]
        })
    }
}