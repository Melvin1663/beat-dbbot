module.exports = {
    name: 'notify',
    description: 'Turns off the "Now Playing" message everytime a song is played',
    run: async (Discord, client, msg, args) => {
        let channel = msg.member.voice.channel;
        if (!channel) return msg.channel.send('You need to be in a voice channel');
        if (q && msg.member.voice.channel.id !== msg.guild.me.voice.channel.id) return msg.channel.send(`You need to be in <#${msg.guild.me.voice.channel.id}>`);
        var q = client.queue.get(msg.guild.id);
        if (!q) return msg.reply('No Song is playing');

        q.notify = q.notify ? false : true;

        return msg.channel.send(`${q.notify ? '🔔' : '🔕'} Notifications has been turned ${q.notify ? 'on' : 'off'}`);
    }
}