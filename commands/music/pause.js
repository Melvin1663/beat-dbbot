module.exports = {
    name: 'pause',
    description: 'Pauses the current song playing',
    memberOnly: false,
    run: async (Discord, client, msg, args) => {
        let channel = msg.member.voice.channel;
        if (!channel) return msg.channel.send('You need to be in a voice channel');
        var q = client.queue.get(msg.guild.id);
        if (q && msg.member.voice.channel.id !== msg.guild.me.voice.channel.id) return msg.channel.send(`You need to be in <#${msg.guild.me.voice.channel.id}>`);
        if (!q || !q.songs.length) return msg.channel.send('No Song is playing');
        if (q.playing == false) return msg.channel.send('Song is already paused')

        q.player?.pause();
        q.playing = false;
        return msg.react('✅');
    }
}