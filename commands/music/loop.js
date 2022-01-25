module.exports = {
    name: 'loop',
    description: 'Loop songs',
    usage: '>loop',
    run: async (Discord, client, msg, args) => {
        let channel = msg.member.voice.channel;
        if (!channel) return msg.channel.send('You need to be in a voice channel');
        if (q && msg.member.voice.channel.id !== msg.guild.me.voice.channel.id) return msg.channel.send(`You need to be in <#${msg.guild.me.voice.channel.id}>`);
        var q = client.queue.get(msg.guild.id);
        if (!q) return msg.channel.send('No Songs are playing');

        q.loop = !q.loop ? true : false;
        msg.reply(`🔁 ${q.loop ? 'Now' : 'No longer'} looping the queue`);
    }
}