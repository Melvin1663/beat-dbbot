module.exports = {
    name: 'ping',
    description: 'Bot Latency info',
    usage: '>ping',
    run: async (Discord, client, msg, args) => {
        msg.channel.send(`**Message:** \`${Math.abs(Date.now() - msg.createdTimestamp)}ms\`\n**Web Socket:** \`${client.ws.ping}ms\``)
    }
}