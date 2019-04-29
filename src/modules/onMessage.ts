///<reference path="../../node_modules/discord.js/typings/index.d.ts"/>

import { Message, TextChannel, RichEmbed } from "discord.js";
import { Loger } from './loger';
import { HelpCommand } from './commands/helpCommand'
import { RaidCommand } from './commands/raidCommand'
const Discord = require('discord.js');
const { prefix } = require('../config.json');

export class OnMessage {

  private loger = new Loger();

  constructor(
    private message: Message,
  ) {
    // Pokračovat pouze pokud výraz začíná prefixem a není od BOTa
    if (!message.content.startsWith(prefix) || message.author.bot) {
      return
    };

    // Ignore DM channels.
    if (message.channel.type === 'dm') {
      message.author.send('Příkazy se dají použít pouze na servru.');
      return;
    }

    // Vypisuje všechny zprávy na servrech, které prošli přes podmínky ^
    this.messageInfo(message);

    // Získání commandu
    const args = message.content.slice(prefix.length).split(' ');
    let command = args.shift().toLowerCase();

    // Vypisuje commandy
    this.loger.log(`Command > ${command}`);

    if (command === 'help') {
      let help = new HelpCommand(message, args);
      return;
    }

    if (command === 'raid') {
      let raid = new RaidCommand(message, args);
      return;
    }

    let help = new HelpCommand(message);
    help.sendMsgHelp(help.getMsgType('help'), message, 'příkaz nerozpoznán! Zde je seznam příkazů.');
  }

  /** Vypíše do konzole informace o zprávě
   * @param message discord message object
   */
  messageInfo(message: Message): void {
    const textChannel = <TextChannel>message.channel;
    const msg = `Message:\nAutor   > ${message.author.username} - (${message.author.id})\nServer  > ${message.guild.name} - (${message.guild.id})\nChannel > ${textChannel.name} - (${textChannel.id})\nMessage > (${message.id}) - "${message.content}"`;
    this.loger.log(msg);
  }
}