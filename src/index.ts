///<reference path="./../node_modules/discord.js/typings/index.d.ts"/>

import { OnMessage } from './modules/onMessage';
import { Message, Client } from 'discord.js';
const Discord = require('discord.js');
const { token } = require('./config.json');
const client: Client = new Discord.Client();

client.on('ready', () => {
  console.log('>>> Code Bar BOT started! <<<');
});

client.on('message', (message: Message) => {
  new OnMessage(message);
});

client.login(token);
