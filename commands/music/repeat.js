module.exports = {
    name: 'repeat',
    description: 'Repeat songs',
    usage: '>repeat',
    run: async (Discord, client, msg, args) => {
        let channel = msg.member.voice.channel;
        if (!channel) return msg.channel.send('You need to be in a voice channel');
        if (q && msg.member.voice.channel.id !== msg.guild.me.voice.channel.id) return msg.channel.send(`You need to be in <#${msg.guild.me.voice.channel.id}>`);
        var q = client.queue.get(msg.guild.id);
        if (!q) return msg.channel.send('No Songs are playing');

        q.repeat = !q.repeat ? true : false;
        msg.reply(`🔁 ${q.repeat ? 'Now' : 'No longer'} looping the track`);
    }
}