"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const onMessage_1 = require("./modules/onMessage");
const Discord = require('discord.js');
const { token } = require('./config.json');
const client = new Discord.Client();
client.on('ready', () => {
    client.user.setActivity('code~help', { type: 'PLAYING' });
    console.log('>>> Code Bar BOT started! <<<');
});
client.on('message', (message) => {
    new onMessage_1.OnMessage(message);
});
client.login(token);
