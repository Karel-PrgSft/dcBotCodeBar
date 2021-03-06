"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const utils_1 = require("../utils");
const Discord = require('discord.js');
require('dotenv/config');
class Command {
    constructor(message, args, send) {
        this.message = message;
        this.args = args;
        this.send = send;
        this.prefix = process.env.PREFIX;
        this.utils = new utils_1.Utils();
        this.ritchEmbed = new discord_js_1.RichEmbed();
        this.ritchEmbed
            .setColor('#ff0000')
            .setThumbnail('http://volimpivo.ba/wordpress/wp-content/uploads/2017/04/bordinos-beer-druthers.png')
            .setTimestamp()
            .setFooter('CODE BAR', 'http://volimpivo.ba/wordpress/wp-content/uploads/2017/04/bordinos-beer-druthers.png');
        if (send === true) {
            this.vyhodnotCommand();
        }
    }
    vyhodnotCommand() {
        const subCommand = this.args === null ? '' : this.args.shift();
        this.utils.log(`Command > help > ${subCommand}`);
        if (subCommand === 'raid') {
            this.sendMsgHelp(this.getMsgType('helpRaid'), 'zde je seznam příkazů pro raid.');
            return;
        }
        if (subCommand === undefined) {
            this.sendMsgHelp(this.getMsgType('help'));
            return;
        }
        this.sendMsgHelp(this.getMsgType('help'), 'příkaz nerozpoznán! Zde je seznam příkazů.');
    }
    sendMsgHelp(msg, text) {
        this.message.channel.send(`<@!${this.message.author.id}>, ${text !== undefined ? text : 'zde je seznam příkazů.'}`);
        this.message.channel.send(msg);
    }
    getMsgType(type) {
        const msg = new Discord.RichEmbed(this.ritchEmbed);
        const prikazyZaklad = `'${this.prefix}help' - Zobrazí tuto nápovědu`;
        const prikazyRaid = `'${this.prefix}raid' - Vypíše seznam příkazů pro RAID Shadow Legends.
      '${this.prefix}raid hero (název hrdiny)' - Vypíše hodnocení hrdiny.`;
        switch (type) {
            case 'help':
                msg
                    .addField('Základní příkazy', prikazyZaklad)
                    .addField('Příkazy pro RAID', prikazyRaid);
                break;
            case 'helpRaid':
                msg.addField('Příkazy pro RAID', prikazyRaid);
                break;
        }
        return msg;
    }
}
exports.Command = Command;
