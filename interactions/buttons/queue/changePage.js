module.exports = async (json, client, Discord, int) => {
    if (!json.data) return int.reply("The Interaction contained incomplete information");

    if (!int.deffered && !int.replied) await int.deferUpdate().catch(console.log);

    let genQ = require('../../../functions/genQ');
    let q = client.queue.get(int.guild.id);
    if (!q) return;
    let page = +(int.message.content.replace('Page ', '').replace(/\*\*/g, '').split('/')[0]);
    let totalPage = ~~(q.songs.length / 10) == 0 ? 1 : ~~(q.songs.length / 10);
    let nPage;

    switch (json.data) {
        case 'left2': nPage = 1; break;
        case 'left': nPage = page - 1; break;
        case 'right': nPage = page + 1; break;
        case 'right2': nPage = totalPage; break;
        default: 1;
    }

    if (nPage == 1) {
        int.message.components[0].components[0].disabled = true;
        int.message.components[0].components[1].disabled = true;
        int.message.components[0].components[2].disabled = false;
        int.message.components[0].components[3].disabled = false;
    }

    if (![1, totalPage].includes(nPage)) {
        int.message.components[0].components[0].disabled = false;
        int.message.components[0].components[1].disabled = false;
        int.message.components[0].components[2].disabled = false;
        int.message.components[0].components[3].disabled = false;
    }

    if (nPage == totalPage) {
        int.message.components[0].components[0].disabled = false;
        int.message.components[0].components[1].disabled = false;
        int.message.components[0].components[2].disabled = true;
        int.message.components[0].components[3].disabled = true;
    }

    let res = genQ(q, nPage)

    int.message.embeds[0].description = res.join('\n');
    int.message.edit({ content: `Page **${nPage.toLocaleString()}**/**${totalPage.toLocaleString()}**`, embeds: int.message.embeds, components: int.message.components });
}