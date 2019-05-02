﻿const Discord = require('discord.js');
const randomPuppy = require('random-puppy');
const SQLite = require("better-sqlite3");
const sql = new SQLite('./main.sqlite');

const sreddits = [
    "Hyiff",
    "yiff",
    "fyiff",
    "FeralYiff",
    "yiffgif"
]
exports.run = (client, message) => {


	client.getSettings = sql.prepare("SELECT * FROM settings WHERE guildid = ?");
	client.setSettings = sql.prepare("INSERT OR REPLACE INTO settings (guildid, guildname, nsfw, economy, music) VALUES (@guildid, @guildname, @nsfw, @economy, @music);");
	Settings = client.getSettings.get(message.guild.id);

	if (!Settings) {
		Settings = { guildid: message.guild.id, guildname: message.guild.name, nsfw: "false", economy: "true", music: "true" }
	}
	client.setSettings.run(Settings);

	if (Settings.nsfw == 'true') {

		if (!message.channel.nsfw) {
			message.react('🚫');
			return message.channel.send("Sorry, this isn't a NSFW Channel.");
		}

		var ranSub = sreddits[Math.floor(Math.random() * sreddits.length)];

		randomPuppy(ranSub)
			.then(url => {
				const dogEmbed = new Discord.RichEmbed()
					.setAuthor("Yiff")
					.setImage(url)
					.setColor(client.config.naughtyColor)
					.setFooter("FennecBot Version: " + client.config.botversion);
				return message.channel.send(dogEmbed);
			})
	} else {

		return message.channel.send("NSFW Module is disabled for this server! Tell someone with administrative privileges to do //settings to change it.");

	}

};