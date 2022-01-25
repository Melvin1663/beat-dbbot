const ytpl = require("ytpl");
const yts = require('youtube-search');
const ytdl = require("ytdl-core");
const moment = require('moment');
const hhmmss = require('hhmmss');
const hhmmssToSec = require('hhmmsstosec');
const Discord = require('discord.js')

module.exports = async (query, client, msg) => {
    const url = query ? query.replace(/<(.+)>/g, "$1") : '';
    if (!url) return { code: 1, txt: 'No Query given' };

    try {
        if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
            try {
                const playlist = await ytpl(url).catch(console.log)
                if (!playlist) return { code: 1, txt: 'No results found' }
                const videos = await playlist.items;

                let vid_list = [];
                for (const video of videos) {
                    if (video.isPlayable) {
                        vid_list.push({
                            type: 'video',
                            id: video.id,
                            title: Discord.Util.escapeMarkdown(video.title),
                            url: video.shortUrl,
                            img: video.bestThumbnail.url,
                            duration: video.isLive == false ? video.duration : 'LIVE',
                            ago: '?',
                            views: '?',
                            req: msg.author,
                            start: 0,
                            live: video.isLive,
                            startedAt: 0,
                            channel: Discord.Util.escapeMarkdown(video.author.name),
                            channelLink: video.author.url,
                            likes: '?',
                            category: '?',
                            ageRestricted: false
                        })
                    }
                }

                return { code: 0, txt: 'Success', res: [vid_list, playlist] }
            } catch (e) {
                console.log(e);
                return { code: 4, txt: 'An Error occured' }
            }
        } else if (url.match(/^https?:\/\/open.spotify.com\/playlist(.*)$/)) {
            return { code: 2, txt: 'Ability to play spotify playlists is coming sooooooon' };
        } else if (url.match(/^https?:\/\/open.spotify.com\/track(.*)$/)) {
            return { code: 2, txt: 'Ability to play spotify tracks is coming soooooon' };
        } else if (url.match(/^(https?:\/\/)?(www\.)?(m\.)?(youtube\.com|youtu\.?be)\/.+$/gi)) {
            let songInfo = await ytdl.getBasicInfo(url);
            if (!songInfo) return { code: 1, txt: 'Video unavailable' };

            let song = {
                type: 'video',
                id: songInfo.videoDetails.videoId,
                title: Discord.Util.escapeMarkdown(songInfo.videoDetails.title),
                url: songInfo.videoDetails.video_url,
                img: songInfo.videoDetails.thumbnails[songInfo.videoDetails.thumbnails.length - 1].url,
                duration: songInfo.videoDetails.isLiveContent == false ? hhmmss(songInfo.videoDetails.lengthSeconds) : 'LIVE',
                ago: moment(songInfo.videoDetails.publishDate, 'YYYY-MM-DD').fromNow(),
                views: parseInt(songInfo.videoDetails.viewCount).toLocaleString(),
                req: msg.author,
                start: 0,
                live: songInfo.videoDetails.isLiveContent,
                startedAt: 0,
                channel: Discord.Util.escapeMarkdown(songInfo.videoDetails.ownerChannelName),
                channelLink: Discord.Util.escapeMarkdown(songInfo.videoDetails.ownerProfileUrl),
                likes: parseInt(!songInfo.videoDetails.likes ? 0 : songInfo.videoDetails.likes).toLocaleString(),
                category: songInfo.videoDetails.category,
                ageRestricted: songInfo.videoDetails.age_restricted,
            };
            if (!song.live && hhmmssToSec(song.duration) > 43200000) return { code: 3, txt: 'Song must be under 12 hours in length' };
            return { code: 0, txt: 'Success', res: song };
        } else {
            let vids = await yts(query, { maxResults: 1, type: 'video', key: process.env.YT_KEY });
            if (!vids.results?.length) return { code: 1, txt: 'No Results' };

            let songInfo = await ytdl.getBasicInfo(vids.results[0]?.link);
            if (!songInfo) return { code: 1, txt: 'Video unavailable' };

            let song = {
                type: 'video',
                id: songInfo.videoDetails.videoId,
                title: Discord.Util.escapeMarkdown(songInfo.videoDetails.title),
                url: songInfo.videoDetails.video_url,
                img: songInfo.videoDetails.thumbnails[songInfo.videoDetails.thumbnails.length - 1].url,
                duration: songInfo.videoDetails.isLiveContent == false ? hhmmss(songInfo.videoDetails.lengthSeconds) : 'LIVE',
                ago: moment(songInfo.videoDetails.publishDate, 'YYYY-MM-DD').fromNow(),
                views: parseInt(songInfo.videoDetails.viewCount).toLocaleString(),
                req: msg.author,
                start: 0,
                live: songInfo.videoDetails.isLiveContent,
                startedAt: 0,
                channel: Discord.Util.escapeMarkdown(songInfo.videoDetails.ownerChannelName),
                channelLink: Discord.Util.escapeMarkdown(songInfo.videoDetails.ownerProfileUrl),
                likes: parseInt(!songInfo.videoDetails.likes ? 0 : songInfo.videoDetails.likes).toLocaleString(),
                category: songInfo.videoDetails.category,
                ageRestricted: songInfo.videoDetails.age_restricted,
            };
            if (!song.live && hhmmssToSec(song.duration) > 43200000) return { code: 3, txt: 'Song must be under 12 hours in length' };
            return { code: 0, txt: 'Success', res: song };
        }
    } catch (e) {
        console.log(e)
        return { code: 4, txt: 'An Error occured' }
    }
}