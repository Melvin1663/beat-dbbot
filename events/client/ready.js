module.exports = (Discord, client) => {
    console.log(`Logged in as ${client.user.tag}`)
    client.user.setActivity('Music', { type: 'PLAYING' })
}