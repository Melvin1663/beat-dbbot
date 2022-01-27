const voice = require('@discordjs/voice');
const ytdl = require('ytdl-core');
const hhmmss = require('hhmmss');

module.exports = async (msg, client, Discord) => {
    var q = client.queue.get(msg.guild.id);

    const player = voice.createAudioPlayer({
        behaviors: {
            noSubscriber: voice.NoSubscriberBehavior.Pause,
        },
    });

    player.on('idle', async () => {
        let a = 0
        if (!q.songs.length) {
            q.player?.removeAllListeners()
            q.player?.stop();
            client.queue.delete(msg.guild.id);
            return a++;
        }
        if (q.repeat == true) { a++ };
        if (q.loop == true && q.repeat == false) {
            let b = q.songs.shift();
            q.songs.push(b);
            a++
        };

        if (a == 0) q.songs.shift();

        if (!q.songs.length) {
            q.player.removeAllListeners()
            q.player.stop();
            client.queue.delete(msg.guild.id);
            return;
        }

        await player.play(voice.createAudioResource(await ytdl(q.songs[0].url, { quality: "highestaudio", highWaterMark: 1 << 25, type: "opus", filter: 'audioonly' }), { inlineVolume: true }));
        q.connection.state.subscription.player.state.resource.volume.setVolume(q.volume)
    })

    let e = 0

    player.on('error', err => {
        console.error('[STREAM]' + err)
        e++
        q.textChannel.send('An error occured while playing the song: ' + err.message)
        if (q.songs.length > 1) q.songs.shift();
        require('./play')(msg, client, Discord)
    })

    if (e == 1) return;

    if (!q.songs.length) {
        q.player.removeAllListeners()
        q.player.stop();
        client.queue.delete(msg.guild.id);
        return;
    }

    q.player = player;

    await player.play(voice.createAudioResource(await ytdl(q.songs[0].url, { quality: "highestaudio", highWaterMark: 1 << 25, type: "opus", filter: 'audioonly' }), { inlineVolume: true }));

    q.connection.subscribe(player);
    q.connection.state.subscription.player.state.resource.volume.setVolume(q.volume)

    q.connection.on('disconnected', () => {
        q.connection?.destroy();
        player?.removeAllListeners();
        player?.stop();
        client.queue.delete(msg.guild.id)
    })

    player.on('playing', (oS, nS) => {
        if (oS.status == 'paused') return;
        if (oS.status == 'autopaused') return;
        console.log(oS.status, nS.status)

        if (!q.songs.length) {
            q.player.removeAllListeners()
            q.player.stop();
            client.queue.delete(msg.guild.id);
            return;
        }
        let song = q.songs[0];
        if (!song) return;
        if (q.first == true || q.notify == true) {
            if (q.first == true) q.first = false;
            if (q.loop == false || q.repeat == false) {
                let thing = new Discord.MessageEmbed()
                    .setAuthor({ name: 'Now Playing', iconURL: 'https://i.imgur.com/5I8C0jo.gif' })
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
                        { name: 'Age Restricted', value: song.ageRestricted ? 'Yes' : 'No', inline: true }
                    )
                    .setFooter({ text: `Views: ${song.views} | ${song.ago}` })

                return msg.channel.send({ embeds: [thing] });
            }
        }
    })
}