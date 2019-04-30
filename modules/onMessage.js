"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const loger_1 = require("./loger");
const helpCommand_1 = require("./commands/helpCommand");
const raidCommand_1 = require("./commands/raidCommand");
const { prefix } = require('../config.json');
class OnMessage {
    constructor(message) {
        this.message = message;
        this.loger = new loger_1.Loger();
        if (!message.content.startsWith(prefix) || message.author.bot) {
            return;
        }
        if (message.channel.type === 'dm') {
            message.author.send('Příkazy se dají použít pouze na servru.');
            return;
        }
        this.messageInfo(message);
        const args = message.content.slice(prefix.length).split(' ');
        const command = args.shift().toLowerCase();
        this.loger.log(`Command > ${command}`);
        if (command === 'help') {
            new helpCommand_1.HelpCommand(message, args);
            return;
        }
        if (command === 'raid') {
            new raidCommand_1.RaidCommand(message, args);
            return;
        }
        const help = new helpCommand_1.HelpCommand(message);
        help.sendMsgHelp(help.getMsgType('help'), message, 'příkaz nerozpoznán! Zde je seznam příkazů.');
    }
    messageInfo(message) {
        const textChannel = message.channel;
        const msg = `Message:\nAutor   > ${message.author.username} - (${message.author.id})\nServer  > ${message.guild.name} - (${message.guild.id})\nChannel > ${textChannel.name} - (${textChannel.id})\nMessage > (${message.id}) - "${message.content}"`;
        this.loger.log(msg);
    }
}
exports.OnMessage = OnMessage;
