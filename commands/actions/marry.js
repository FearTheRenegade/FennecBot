﻿const { marry } = require('../../assets/json/actions.json');
const { stripIndents } = require('common-tags');

module.exports = {
    name: 'marry',
    description: 'Propose to another user',
    usage: '//marry <user>',
    cooldown: 1,
    execute(client, message, args, sql) {


        client.getProfile = sql.prepare("SELECT * FROM profile WHERE id = ?");
        client.setProfile = sql.prepare("INSERT OR REPLACE INTO profile (id, user, zone, birth, gender, dwins, marry) VALUES (@id, @user, @zone, @birth, @gender, @dwins, @marry);");
        authorProfile = client.getProfile.get(message.author.id);

        if (!profile || !victimProfile) return message.reply(`One of you doesn't have a profile setup, try //profile first.`);
        var aMarry = marry[Math.floor(Math.random() * marry.length)];

        var victim = message.mentions.users.first() || client.users.get(args[0]);

        if (victim == message.author) {

            return message.reply("You can't propose to yourself.");

        } else if (!victim) {

            return message.reply("Please mention a user to propose to!");

        } else if (victim == client) {

            return message.reply("Thanks, but I'm not on the market.")

        } else {

            var victimProfile = client.getProfile.get(victim.id);

            if (authorProfile.marry != "Nobody") return message.reply(`Sorry bubby, you're already married. Have an affair I guess.`);
            if (victimProfile.marry != "Nobody") return message.reply(`Sorry, they're not looking for someone else.`);

            if (!victimProfile || !authorProfile) return message.reply(`One of you doesn't have a profile yet!`);

            var marryMsg = stripIndents`
    ${victim}, Do you accept ${message.author}'s marriage proposal? (React below for your choice)
    ${aMarry}`;


            message.channel.send(marryMsg).then(marryMsg => {

                marryMsg.react('✅').then(() => marryMsg.react('❌'));

                const filter = (reaction, user) => {
                    return ['✅', '❌'].includes(reaction.emoji.name) && user.id === victim.id;
                };

                marryMsg.awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] })
                    .then(collected => {
                        const reaction = collected.first();

                        if (reaction.emoji.name === '✅') {

                            victimProfile.marry = message.author.id;
                            authorProfile.marry = victim.id;

                            client.setProfile.run(victimProfile);
                            client.setProfile.run(authorProfile);

                            return message.channel.send(`Pop the champagne! ${victim} and ${message.author} are now hitched!`);

                        } else message.reply(`Marriage Proposal Declined.`);
                    })
            });
        }
    },
};