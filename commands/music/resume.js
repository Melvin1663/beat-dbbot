module.exports = {
    name: 'resume',
    description: 'Resumes the current song paused',
    usage: '>resume',
    run: async (Discord, client, msg, args) => {
        let channel = msg.member.voice.channel;
        if (!channel) return msg.channel.send('You need to be in a voice channel');
        var q = client.queue.get(msg.guild.id);
        if (q && msg.member.voice.channel.id !== msg.guild.me.voice.channel.id) return msg.channel.send(`You need to be in <#${msg.guild.me.voice.channel.id}>`);
        if (!q || !q.songs.length) return msg.channel.send('No Song is paused');
        if (q.playing == true) return msg.channel.send('Song is already playing');

        q.player?.unpause();
        q.playing = true;
        return msg.react('✅');
    }
}