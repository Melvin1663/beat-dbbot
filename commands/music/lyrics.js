const lyrics = require('lyrics-finder');
const yt = require('yt-search'); 

module.exports = {
    name: 'lyrics',
    description: 'Find the lyrics of a song',
    aliases: ['l'],
    usage: '>lyrics (song title)',
    run: async (Discord, client, msg, args) => {
        let q = client.queue.get(msg.guild.id)

        if (!args.length && !q) return msg.channel.send('No song specified');
        else if (!args.length && q) args[0] = q.songs[0].title

        let embed = new Discord.MessageEmbed().setColor('RANDOM').setFooter({ text: `Requested by ${msg.author.tag}`, iconURL: msg.author.displayAvatarURL()}); 
        let lyric = await lyrics(args.join(' ')); 
        let noLyric = 0 

        if (!lyric) {
            lyric = `No Lyrics found for ${args.join(' ')}`; 
            noLyric++
        }

        embed.setDescription(lyric.length >= 4093 ? lyric.substring(0, 4093) + '...' : lyric); 

        if (noLyric == 0) {
            let res = await yt.search(args.join(' '));
            let song = res.videos[0];
            if (song) embed.setTitle(song.title).setURL(song.url).setThumbnail(song.image)
        }

        msg.channel.send({ embeds: [embed] });
    }
}