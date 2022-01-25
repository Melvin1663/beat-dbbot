const voice = require('@discordjs/voice');

module.exports = {
    name: 'play',
    description: 'Play Music in a Discord VC',
    aliases: ['p'],
    usage: '>play [song title/url]',
    run: async (Discord, client, msg, args) => {
        let channel = msg.member.voice.channel;
        if (!channel) return msg.channel.send('You need to be in a voice channel');
        var q = client.queue.get(msg.guild.id);
        if (q && msg.member.voice.channel.id !== msg.guild.me.voice.channel.id) return msg.channel.send(`You need to be in <#${msg.guild.me.voice.channel.id}>`)
        let music = await require('../../functions/getMusic')(args.join(' '), client, msg);
        if (music.code != 0) return msg.channel.send(music.txt || 'An error occured');
        if (q) {
            let isPlaylist = false
            if (music.res.length) {
                q.songs.push(...music.res[0]);
                isPlaylist = true;
            }
            else q.songs.push(music.res);

            const song = q.songs[0];
            let thing;

            if (isPlaylist) {
                let pl = music.res[1];
                let totalDur = 0;
                let playableSongs = 0;
                music.res[0].forEach(v => {
                    totalDur += v.durationSec;
                    v.isPlayable ? playableSongs++ : {};
                })
                thing = new Discord.MessageEmbed()
                    .setAuthor('Added to Queue', 'https://i.imgur.com/5I8C0jo.gif')
                    .setColor('YELLOW')
                    .setThumbnail(pl.bestThumbnail.url)
                    .setTitle(Discord.Util.escapeMarkdown(pl.title))
                    .setURL(pl.url)
                    .addFields(
                        { name: 'Channel', value: `[${pl.author.name}](${pl.author.url})`, inline: true },
                        { name: 'Duration', value: require('hhmmss')(totalDur) ?? '?', inline: true },
                        { name: 'Requested by', value: song.req.toString(), inline: true },
                        { name: 'ID', value: pl.id ?? '?', inline: true },
                        { name: 'Song Count', value: pl.items.length, inline: true },
                        { name: 'Playable Songs', value: playableSongs.toLocaleString(), inline: true }
                    )
                    .setFooter(`Views: ${pl.views.toLocaleString()} | ${pl.lastUpdated}`)
            } else thing = new Discord.MessageEmbed()
                .setAuthor('Added to Queue', 'https://i.imgur.com/5I8C0jo.gif')
                .setColor('YELLOW')
                .setThumbnail(song.img)
                .setTitle(song.title)
                .setURL(song.url)
                .addFields(
                    { name: 'Channel', value: `[${song.channel}](${song.channelLink})`, inline: true },
                    { name: 'Duration', value: song.duration, inline: true },
                    { name: 'Requested by', value: song.req.toString(), inline: true },
                    { name: 'Category', value: song.category, inline: true },
                    { name: 'Likes', value: song.likes.toLocaleString(), inline: true },
                    { name: 'Age Restricted', value: song.ageRestricted ? 'Yes' : 'No', inline: true },
                )
                .setFooter(`Views: ${song.views.toLocaleString()} | ${song.ago}`)

            return msg.channel.send({ embeds: [thing] });
        }

        const qConstruct = {
            textChannel: msg.channel,
            voiceChannel: channel,
            connection: null,
            player: null,
            songs: [],
            volume: 1,
            playing: true,
            loop: false,
            repeat: false,
            notify: true,
            first: true
        };

        if (music.res.length) qConstruct.songs.push(...music.res[0]);
        else qConstruct.songs.push(music.res);
        client.queue.set(msg.guild.id, qConstruct);

        try {
            let q = client.queue.get(msg.guild.id)
            if (!q.connection) {
                const connection = voice.joinVoiceChannel({
                    channelId: channel.id,
                    guildId: channel.guild.id,
                    adapterCreator: channel.guild.voiceAdapterCreator,
                });
                q.connection = connection;
            }

            if (music.res.length) {
                let pl = music.res[1];
                let totalDur = 0;
                let playableSongs = 0;
                const song = q.songs[0];
                music.res[0].forEach(v => {
                    totalDur += v.durationSec;
                    v.isPlayable ? playableSongs++ : {};
                })
                let thing = new Discord.MessageEmbed()
                    .setAuthor('Added to Queue', 'https://i.imgur.com/5I8C0jo.gif')
                    .setColor('YELLOW')
                    .setThumbnail(pl.bestThumbnail.url)
                    .setTitle(Discord.Util.escapeMarkdown(pl.title))
                    .setURL(pl.url)
                    .addFields(
                        { name: 'Channel', value: `[${pl.author.name}](${pl.author.url})`, inline: true },
                        { name: 'Duration', value: require('hhmmss')(totalDur) ?? '?', inline: true },
                        { name: 'Requested by', value: song.req.toString(), inline: true },
                        { name: 'ID', value: pl.id ?? '?', inline: true },
                        { name: 'Song Count', value: pl.items.length.toLocaleString(), inline: true },
                        { name: 'Playable Songs', value: playableSongs.toLocaleString(), inline: true }
                    )
                    .setFooter(`Views: ${pl.views.toLocaleString()} | ${pl.lastUpdated}`)

                msg.channel.send({ embeds: [thing] });
            }

            await require('../../functions/play')(msg, client, Discord)
        } catch (e) {
            client.queue.get(msg.guild.id).connection?.destroy();
            client.queue.delete(msg.guild.id)
            console.log(e);
        }
    }
}