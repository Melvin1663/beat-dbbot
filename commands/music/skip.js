module.exports = {
    name: 'skip',
    description: 'Skips songs yes.',
    usage: '>skip (amount)',
    run: async (Discord, client, msg, args) => {
        let channel = msg.member.voice.channel;
        if (!channel) return msg.channel.send('You need to be in a voice channel');
        var q = client.queue.get(msg.guild.id);
        if (!q) return msg.channel.send('There are no songs in the queue');
        if (q && msg.member.voice.channel.id !== msg.guild.me.voice.channel.id) return msg.channel.send(`You need to be in <#${msg.guild.me.voice.channel.id}>`)
        if (args.length && args[0] > q.songs.length) return msg.channel.send(`There's only \`${q.songs.length}\` songs in the queue`)

        let lSong;
        q.player?.removeAllListeners();
        q.player?.stop();

        if (!args.length) {
            lSong = q.songs.shift();
        } else {
            q.songs.splice(0, parseInt(args[0]))
        }

        await require('../../functions/play')(msg, client, Discord);

        return msg.channel.send({
            embeds: [
                new Discord.MessageEmbed()
                    .setAuthor({ name: "Song Skipper", iconURL: 'https://i.imgur.com/5I8C0jo.gif'})
                    .setColor('BLUE')
                    .setDescription(args.length ? `Skipped \`${args[0]} song${args[0] == 1 ? '' : 's'}\`` : `Skipped [${lSong.title}](${lSong.url})`)
            ]
        });
    }
}