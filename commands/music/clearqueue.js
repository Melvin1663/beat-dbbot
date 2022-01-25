module.exports = {
    name: 'clearqueue',
    description: 'Removes all the songs from the queue',
    usage: '>clearqueue',
    aliases: ['cq'],
    run: async (Discord, client, msg, args) => {
        let channel = msg.member.voice.channel;
        if (!channel) return msg.channel.send('You need to be in a voice channel');
        var q = client.queue.get(msg.guild.id);

        if (!q) return msg.channel.send('There are no Songs in the queue');

        if (!q.songs.length) return msg.channel.send('There are no Songs in the queue')

        q.player.removeAllListeners()
        q.player.stop();
        client.queue.delete(msg.guild.id);

        msg.react('✅');
    }
}