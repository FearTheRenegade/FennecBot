﻿const { TZ } = require('../../assets/json/AmericanTimeZones.json')

module.exports = {
    name: 'timezone',
    description: 'Set your timezone on the profile.',
    aliases: ['tz', 'zone'],
    usage: '//timezone <timezone>',
    cooldown: 2,
    execute(client, message, args, sql) {

        client.getProfile = sql.prepare("SELECT * FROM profile WHERE id = ?");
        client.setProfile = sql.prepare("INSERT OR REPLACE INTO profile (id, user, zone, birth, gender, marry, bio) VALUES (@id, @user, @zone, @birth, @gender, @marry, @bio);");
        Profile = client.getProfile.get(message.author.id);

        if (!Profile) {
            Profile = {
                id: message.author.id, user: message.author.username, zone: "not set", birth: "not set", gender: "not set", marry: "Nobody", bio: "//bio"
            }
        }
        client.setProfile.run(Profile);

        var zone = args[0];
        var uZone = zone.toUpperCase();


        if (TZ.includes(uZone) == true) {

            var data = `UPDATE profile
		SET zone = '${zone}'
		WHERE id = ${message.author.id};`

            sql.exec(data);

            return message.reply(`Success! Your time-zone has been set to ${zone}`);

        } else {

            return message.reply(`Please choose a proper Timezone.`);

        }
    },
};