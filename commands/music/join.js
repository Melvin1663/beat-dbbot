const voice = require('@discordjs/voice');

module.exports = {
    name: 'join',
    description: 'Bot joins a voice channel',
    usage: '>join',
    run: async (Discord, client, msg, args) => {
        let channel = msg.member.voice.channel;
        if (!channel) return msg.channel.send('You need to be in a voice channel');
        var q = client.queue.get(msg.guild.id);
        if (q || msg.guild.me.voice.channel) return msg.channel.send(`I'm already connected to ${msg.guild.me.voice.channel.toString()}`)
        
        let connection = await voice.joinVoiceChannel({
            channelId: channel.id,
            guildId: channel.guild.id,
            adapterCreator: channel.guild.voiceAdapterCreator,
        });

        const qConstruct = {
            textChannel: msg.channel,
            voiceChannel: channel,
            connection: connection,
            player: null,
            songs: [],
            volume: 1,
            playing: true,
            loop: false,
            repeat: false,
            notify: true,
            first: true
        };

        client.queue.set(msg.guild.id, qConstruct);

        msg.react('✅');
    }
}