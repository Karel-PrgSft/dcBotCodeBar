///<reference path="../../node_modules/discord.js/typings/index.d.ts"/>

import { Message, TextChannel, RichEmbed } from 'discord.js';
import { Utils } from './utils';
import { Command } from './commands/command';
import { RaidCommand } from './commands/raidCommand';
import { DataService } from './dataService';
require('dotenv/config');

export class OnMessage {

  private utils = new Utils();
  private prefix = process.env.PREFIX;

  constructor(
    private ds: DataService,
    private message: Message,
  ) {
    const messageContent = message.content.toLowerCase();

    // Pokračovat pouze pokud výraz začíná prefixem a není od BOTa
    if (!messageContent.startsWith(this.prefix) || message.author.bot) {
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
    const args = messageContent.slice(this.prefix.length).split(' ');
    const command = args.shift().toLowerCase();

    // Vypisuje commandy
    this.utils.log(`Command > ${command}`);

    if (command === 'help') {
      new Command(message, args, true);
      return;
    }

    if (command === 'raid') {
      new RaidCommand(ds, message, args);
      return;
    }

    new Command(message, null, true);
  }

  /** Vypíše do konzole informace o zprávě */
  messageInfo(): void {
    const textChannel = <TextChannel>this.message.channel;
    this.utils.log(`Message:
Autor   > ${this.message.author.username} - (${this.message.author.id})
Server  > ${this.message.guild.name} - (${this.message.guild.id})
Channel > ${textChannel.name} - (${textChannel.id})
Message > (${this.message.id}) - "${this.message.content}"`);
  }
}
