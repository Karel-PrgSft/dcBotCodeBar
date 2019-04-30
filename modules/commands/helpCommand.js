"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const loger_1 = require("../loger");
const Discord = require('discord.js');
const { prefix } = require('../../config.json');
class HelpCommand {
    constructor(message, args) {
        this.message = message;
        this.args = args;
        this.loger = new loger_1.Loger();
        if (args !== undefined) {
            let subCommand = args.shift();
            this.loger.log(`Command > help > ${subCommand}`);
            if (subCommand === 'raid') {
                this.sendMsgHelp(this.getMsgType('helpRaid'), this.message, 'zde je seznam příkazů pro raid.');
            }
            else {
                this.sendMsgHelp(this.getMsgType('help'), this.message);
            }
        }
    }
    sendMsgHelp(msg, message, text) {
        message.channel.send(`<@!${message.author.id}>, ${text !== undefined ? text : 'zde je seznam příkazů.'}`);
        message.channel.send(msg);
    }
    getMsgType(type) {
        let msg = new Discord.RichEmbed();
        let prikazyZaklad = `
      '${prefix}help' - Zobrazí tuto nápovědu`;
        let prikazyRaid = `
      '${prefix}raid' - Vypíše seznam příkazů pro RAID Shadow Legends.
      '${prefix}raid hero (název hrdiny)' - Vypíše hodnocení hrdiny.`;
        msg.setColor('#ff0000');
        msg.setThumbnail('http://volimpivo.ba/wordpress/wp-content/uploads/2017/04/bordinos-beer-druthers.png');
        msg.setTimestamp();
        msg.setFooter('CODE BAR', 'http://volimpivo.ba/wordpress/wp-content/uploads/2017/04/bordinos-beer-druthers.png');
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
exports.HelpCommand = HelpCommand;
