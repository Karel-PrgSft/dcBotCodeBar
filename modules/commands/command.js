"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const loger_1 = require("../loger");
const Discord = require('discord.js');
const { prefix } = require('../../config.json');
class Command {
    constructor(message, args, send) {
        this.message = message;
        this.args = args;
        this.send = send;
        this.loger = new loger_1.Loger();
        this.ritchEmbed = new discord_js_1.RichEmbed();
        this.ritchEmbed.setColor('#ff0000');
        this.ritchEmbed.setThumbnail('http://volimpivo.ba/wordpress/wp-content/uploads/2017/04/bordinos-beer-druthers.png');
        this.ritchEmbed.setTimestamp();
        this.ritchEmbed.setFooter('CODE BAR', 'http://volimpivo.ba/wordpress/wp-content/uploads/2017/04/bordinos-beer-druthers.png');
        if (send === true) {
            this.vyhodnotCommand();
        }
    }
    vyhodnotCommand() {
        const subCommand = this.args === null ? '' : this.args.shift();
        this.loger.log(`Command > help > ${subCommand}`);
        if (subCommand === 'raid') {
            this.sendMsgHelp(this.getMsgType('helpRaid'), this.message, 'zde je seznam příkazů pro raid.');
            return;
        }
        if (subCommand === undefined) {
            this.sendMsgHelp(this.getMsgType('help'), this.message);
            return;
        }
        this.sendMsgHelp(this.getMsgType('help'), this.message, 'příkaz nerozpoznán! Zde je seznam příkazů.');
    }
    sendMsgHelp(msg, message, text) {
        message.channel.send(`<@!${message.author.id}>, ${text !== undefined ? text : 'zde je seznam příkazů.'}`);
        message.channel.send(msg);
    }
    getMsgType(type) {
        const msg = new Discord.RichEmbed();
        msg.setColor('#ff0000');
        msg.setThumbnail('http://volimpivo.ba/wordpress/wp-content/uploads/2017/04/bordinos-beer-druthers.png');
        msg.setTimestamp();
        msg.setFooter('CODE BAR', 'http://volimpivo.ba/wordpress/wp-content/uploads/2017/04/bordinos-beer-druthers.png');
        const prikazyZaklad = `
      '${prefix}help' - Zobrazí tuto nápovědu`;
        const prikazyRaid = `
      '${prefix}raid' - Vypíše seznam příkazů pro RAID Shadow Legends.
      '${prefix}raid hero (název hrdiny)' - Vypíše hodnocení hrdiny.`;
        switch (type) {
            case 'help':
                msg.addField('Základní příkazy', prikazyZaklad);
                msg.addField('Příkazy pro RAID', prikazyRaid);
                break;
            case 'helpRaid':
                msg.addField('Příkazy pro RAID', prikazyRaid);
                break;
        }
        return msg;
    }
}
exports.Command = Command;
