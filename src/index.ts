///<reference path="../node_modules/discord.js/typings/index.d.ts"/>

import { OnMessage } from './modules/onMessage';
import { Message, Client } from 'discord.js';
const Discord = require('discord.js');
import { DataService } from './modules/dataService';
const client: Client = new Discord.Client();
require('dotenv/config');

const token = process.env.TOKEN;
const firebase = new DataService();

client.on('ready', () => {
  client.user.setActivity('code~help', { type: 'PLAYING' });
  console.log('>>> Code Bar BOT started! <<<');
});

client.on('message', (message: Message) => {
  new OnMessage(firebase, message);
});

client.login(token);
