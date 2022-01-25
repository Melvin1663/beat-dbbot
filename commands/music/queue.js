const hhmmss = require('hhmmss');
const hhmmssToSec = require('hhmmsstosec');

module.exports = {
    name: 'queue',
    description: 'Shows the Song queue',
    aliases: ['q'],
    usage: '>queue',
    run: async (Discord, client, msg, args) => {
        const q = client.queue.get(msg.guild.id)
        if (!q || !q.songs.length) return msg.channel.send("There's no Songs in the queue");
        let songs = require('../../functions/genQ')(q, 1);
        let tsl = 0;
        q.songs.forEach(s => {
            tsl += hhmmssToSec(s.duration)
        })

        let embed = new Discord.MessageEmbed()
            .setAuthor('Server Songs Queue', 'https://i.imgur.com/5I8C0jo.gif')
            .setColor('FF55FF')
            .setDescription(songs.join('\n'))
            .setThumbnail(msg.guild.iconURL({ dynamic: true, size: 1024 }))
            .addFields(
                { name: 'Now Playing', value: `[${q.songs[0].title}](${q.songs[0].url})`, inline: true },
                { name: 'Text Channel', value: q.textChannel.toString(), inline: true },
                { name: 'Voice Channel', value: q.voiceChannel.toString(), inline: true },
                { name: 'Volume', value: `🎧 ${Math.trunc(q.volume * 100)}%`, inline: true },
                { name: 'Length', value: `⏱ ${hhmmss(tsl)}`, inline: true },
                { name: 'Songs', value: `🎶 ${q.songs.length.toLocaleString()}`, inline: true }
            )
            .setFooter(`Notifs: ${q.notify ? '✅' : '❌'} | Loop Queue: ${q.loop ? '✅' : '❌'} | Loop Track: ${q.repeat ? '✅' : '❌'} | Playing: ${q.playing ? '✅' : '❌'}`)

        let comps = [];

        comps.push(
            new Discord.MessageActionRow()
                .addComponents(
                    [
                        new Discord.MessageButton()
                            .setStyle('PRIMARY')
                            .setEmoji(`<:arrow_left_2:876016893343973386>`)
                            .setCustomId(JSON.stringify({
                                cmd: 'queue',
                                do: 'changePage',
                                data: 'left2'
                            }))
                            .setDisabled()
                        ,
                        new Discord.MessageButton()
                            .setStyle('PRIMARY')
                            .setEmoji('<:arrow_left:876016893226545153>')
                            .setCustomId(JSON.stringify({
                                cmd: 'queue',
                                do: 'changePage',
                                data: 'left'
                            }))
                            .setDisabled()
                        ,
                        new Discord.MessageButton()
                            .setStyle('PRIMARY')
                            .setEmoji('<:arrow_right:876016892962295840>')
                            .setCustomId(JSON.stringify({
                                cmd: 'queue',
                                do: 'changePage',
                                data: 'right'
                            }))
                        ,
                        new Discord.MessageButton()
                            .setStyle('PRIMARY')
                            .setEmoji('<:arrow_right_2:876016893402705941>')
                            .setCustomId(JSON.stringify({
                                cmd: 'queue',
                                do: 'changePage',
                                data: 'right2'
                            }))
                    ]
                )
        )

        msg.channel.send({ content: ` Page **1**/**${~~(q.songs.length / 10) == 0 ? 1 : ~~(q.songs.length / 10)}**`, embeds: [embed], components: comps })
    }
}