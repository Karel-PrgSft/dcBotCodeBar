///<reference path="../../node_modules/discord.js/typings/index.d.ts"/>

import { Message, TextChannel, RichEmbed } from 'discord.js';
import { Loger } from './loger';
import { Command } from './commands/command';
import { RaidCommand } from './commands/raidCommand';
const { prefix } = require('../config.json');

export class OnMessage {

  private loger = new Loger();

  constructor(
    private message: Message,
  ) {
    const messageContent = message.content.toLowerCase();

    // Pokračovat pouze pokud výraz začíná prefixem a není od BOTa
    if (!messageContent.startsWith(prefix) || message.author.bot) {
      return;
    }

    // Ignore DM channels.
    if (message.channel.type === 'dm') {
      message.author.send('Příkazy se dají použít pouze na servru.');
      return;
    }

    // Vypisuje všechny zprávy na servrech, které prošli přes podmínky ^
    this.messageInfo();

    // Získání commandu
    const args = messageContent.slice(prefix.length).split(' ');
    const command = args.shift().toLowerCase();

    // Vypisuje commandy
    this.loger.log(`Command > ${command}`);

    if (command === 'help') {
      new Command(message, args);
      return;
    }

    if (command === 'raid') {
      new RaidCommand(message, args);
      return;
    }

    new Command(message, null, true);
  }

  /** Vypíše do konzole informace o zprávě */
  messageInfo(): void {
    const textChannel = <TextChannel>this.message.channel;
    this.loger.log(`Message:
Autor   > ${this.message.author.username} - (${this.message.author.id})
Server  > ${this.message.guild.name} - (${this.message.guild.id})
Channel > ${textChannel.name} - (${textChannel.id})
Message > (${this.message.id}) - "${this.message.content}"`);
  }
}
