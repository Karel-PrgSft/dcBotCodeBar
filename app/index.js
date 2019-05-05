"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const onMessage_1 = require("./modules/onMessage");
const dataService_1 = require("./modules/dataService");
const Discord = require('discord.js');
const client = new Discord.Client();
require('dotenv/config');
const token = process.env.TOKEN;
const firebase = new dataService_1.DataService();
client.on('ready', () => {
    client.user.setActivity('code~help', { type: 'PLAYING' });
    console.log('>>> Code Bar BOT started! <<<');
});
client.on('message', (message) => {
    new onMessage_1.OnMessage(firebase, message);
});
client.login(token);
