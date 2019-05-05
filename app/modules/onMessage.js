"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const loger_1 = require("./loger");
const command_1 = require("./commands/command");
const raidCommand_1 = require("./commands/raidCommand");
require('dotenv/config');
class OnMessage {
    constructor(ds, message) {
        this.ds = ds;
        this.message = message;
        this.loger = new loger_1.Loger();
        this.prefix = process.env.PREFIX;
        const messageContent = message.content.toLowerCase();
        if (!messageContent.startsWith(this.prefix) || message.author.bot) {
            return;
        }
        if (message.channel.type === 'dm') {
            message.author.send('Příkazy se dají použít pouze na servru.');
            return;
        }
        this.messageInfo();
        const args = messageContent.slice(this.prefix.length).split(' ');
        const command = args.shift().toLowerCase();
        this.loger.log(`Command > ${command}`);
        if (command === 'help') {
            new command_1.Command(message, args, true);
            return;
        }
        if (command === 'raid') {
            new raidCommand_1.RaidCommand(ds, message, args);
            return;
        }
        new command_1.Command(message, null, true);
    }
    messageInfo() {
        const textChannel = this.message.channel;
        this.loger.log(`Message:
Autor   > ${this.message.author.username} - (${this.message.author.id})
Server  > ${this.message.guild.name} - (${this.message.guild.id})
Channel > ${textChannel.name} - (${textChannel.id})
Message > (${this.message.id}) - "${this.message.content}"`);
    }
}
exports.OnMessage = OnMessage;
