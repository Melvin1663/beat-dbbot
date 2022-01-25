module.exports = async (Discord, client, msg) => {
    const prefix = process.env.PREFIX

    if (msg.content.includes(client.user.id)) msg.channel.send(`My Prefix is \`${prefix}\``).catch(console.log)

    if (!msg.guild || !msg.content.toLowerCase().startsWith(prefix)) return;
    if (!msg.guild.me.permissions.has(['SEND_MESSAGES', 'EMBED_LINKS'])) return;

    const args = msg.content.slice(prefix.length).split(/ +/g);
    const cmd = args.shift().toLowerCase();

    let command = client.commands.get(cmd) || client.commands.find(a => a.aliases?.includes(cmd));

    if (!command) return;

    if (msg.author.id != 731765420897599519) {
        if (!client.cooldowns.has(command.name)) {
            client.cooldowns.set(command.name, {});
        }

        const current_time = Date.now();
        const time_stamps = client.cooldowns.get(command.name);
        const cooldown_amount = (command.cooldown) * 1000;

        if (msg.author.id in time_stamps) {
            const expiration_time = time_stamps[msg.author.id] + cooldown_amount;
            if (current_time < expiration_time) {
                const time_left = (expiration_time - current_time) / 1000;
                return msg.channel.send(`Please wait **${time_left.toFixed(0)} seconds** before using this command.`).catch(console.log)
            }
        }

        time_stamps[msg.author.id] = current_time
        setTimeout(() => delete time_stamps[msg.author.id], cooldown_amount)
    }

    try {
        command.run(Discord, client, msg, args);
    } catch (e) {
        console.log(e);
        msg.channel.send('An Error Occured').catch(console.log)
    }
}