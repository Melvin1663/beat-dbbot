const hhmmss = require('hhmmss');
const pb = require('../../functions/progressBar');
const hhmmssToSec = require('hhmmsstosec');

module.exports = {
    name: 'nowplaying',
    description: 'Shows what song is currently playing',
    aliases: ['np'],
    usage: '>nowplaying',
    run: async (Discord, client, msg, args) => {
        var q = client.queue.get(msg.guild.id);
        if (!q || !q.connection || !q.songs.length) return msg.channel.send("There are no Songs in the queue");

        let song = q.songs[0];
        let curDur = q.connection?.state?.subscription?.player?.state?.resource?.playbackDuration;
        let totalDur = song.duration != 'LIVE' ? hhmmssToSec(song.duration) : curDur / 1000;
        let embed = new Discord.MessageEmbed()
            .setAuthor('Now Playing', 'https://i.imgur.com/5I8C0jo.gif')
            .setColor('GREEN')
            .setThumbnail(song.img)
            .setTitle(song.title)
            .setURL(song.url)
            .addFields(
                { name: 'Channel', value: `[${song.channel}](${song.channelLink})`, inline: true },
                { name: 'Duration', value: song.duration, inline: true },
                { name: 'Requested by', value: song.req.toString(), inline: true },
                { name: 'Category', value: song.category, inline: true },
                { name: 'Likes', value: song.likes, inline: true },
                { name: 'Age Restricted', value: song.ageRestricted ? 'Yes' : 'No', inline: true },
                {
                    name: 'Current Duration',
                    value: `\`${hhmmss(curDur / 1000)}\` ${pb('🔘', '▬', Math.round((((curDur / 1000) + song.startedAt) / totalDur) * 19), 20)} \`${song.duration}\``
                }
            )
            .setFooter(`Views: ${song.views} | ${song.ago}`)


        msg.channel.send({ embeds: [embed] })
    }
}