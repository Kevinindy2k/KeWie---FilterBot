const { Client, MessageEmbed } = require('discord.js');
const chalk = require('chalk')
const client = new Client();
const config = require('./config.json');


client.once('ready', client => {
    console.log(chalk.red`[ KeWie-FilterBot ] ` + chalk.white`Bot is` + chalk.green` online`)
})

client.on('message', async (message) => {
    if (message.author.bot) return;
    if (message.guild !== undefined) {
        config.word_filter.blacklist_badwords.forEach(async badword => {
            if (message.content.toLowerCase().search(badword.toLowerCase()) >= 0) {
                if (!message.member.roles.cache.some(r => config.word_filter.adminbypass.includes(r.id))) {
                    await message.delete().catch(e => { })
                    let kewiebadword = new MessageEmbed()
                        .setDescription(`โปรดใช้คำสุภาพใน ${message.guild.name} ด้วยครับ`)
                        .setColor(config.embed.color)
                        .setFooter(`ผู้กระทำผิด ${message.author.tag}`)
                        .setTimestamp()
                    message.channel.send(kewiebadword).then(msg => msg.delete({ timeout: 5000 }));
                }
            }
        });
    }
    if (message.guild !== undefined) {
        const bannedinvites = config.invite_filter.blacklist_invites
        if (bannedinvites.some(invite => message.content.toLowerCase().includes(invite))) {
            if (!message.member.roles.cache.some(r => config.invite_filter.adminbypass.includes(r.id))) {
                await message.delete().catch(e => { })
                let kewiespam = new MessageEmbed()
                    .setDescription(`ไม่อนุญาตให้ส่งลิ้งคำเชิญหรือลิ้งที่เป็นอันตรายนะครับ`)
                    .setColor(config.embed.color)
                    .setFooter(`ผู้กระทำผิด ${message.author.tag}`)
                    .setTimestamp()
                message.channel.send(kewiespam).then(msg => msg.delete({ timeout: 5000 }));
            }
        }
    }
})

client.login(config.token).then(() => {
    setInterval(() => client.user.setActivity(`${config.presence}`, { type: "WATCHING" }), 10000);
})
