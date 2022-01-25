const messageCreate = require("../../events/guild/messageCreate");

module.exports = {
    name: 'leave',
    description: 'Bot leaves the voice channel',
    usage: '>leave',
    run: async (Discord, client, msg, args) => {
        let vc = msg.guild.me.voice.channel;
        if (!vc) return msg.channel.send("I'm not even connected to any voice channels")
        let channel = msg.member.voice.channel;
        if (!channel && vc.members.length > 1) return msg.channel.send('You need to be in the voice channel');
        var q = client.queue.get(msg.guild.id);

        if (q) {
            q.connection?.destroy();
            q.player?.stop();
            client.queue.delete(msg.guild.id)
            msg.react('✅');
        }
    }
}