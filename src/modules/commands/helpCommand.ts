///<reference path="../../../node_modules/discord.js/typings/index.d.ts"/>

import { Message, RichEmbed } from 'discord.js';
import { Loger } from '../loger';
const Discord = require('discord.js');
const { prefix } = require('../../config.json');

export class HelpCommand {

  private loger = new Loger();

  constructor(
    private message: Message,
    private args?: string[],
  ) {
    if (args !== undefined) {
      const subCommand = args.shift();
      this.loger.log(`Command > help > ${subCommand}`);
      if (subCommand === 'raid') {
        this.sendMsgHelp(this.getMsgType('helpRaid'), this.message, 'zde je seznam příkazů pro raid.');
      } else {
        this.sendMsgHelp(this.getMsgType('help'), this.message);
      }
    }
  }

  /** Odešle nápovědu k příkazům.
   * @param msg getMsgType();
   * @param message Discord object Message
   * @param text default: 'Zde je seznam příkazů.'
   */
  public sendMsgHelp(msg: RichEmbed, message: Message, text?: string) {
    message.channel.send(`<@!${message.author.id}>, ${text !== undefined ? text : 'zde je seznam příkazů.'}`);
    message.channel.send(msg);
  }

  /** Vrátí tělo zprávy podle typu.
   * @param type Zvol typ nápovědy.
   * @returns Discord object RichEmbed (stylyzovaná zpráva)
   */
  public getMsgType(type: 'help' | 'helpRaid'): RichEmbed {
    const msg: RichEmbed = new Discord.RichEmbed();
    msg.setColor('#ff0000');
    msg.setThumbnail('http://volimpivo.ba/wordpress/wp-content/uploads/2017/04/bordinos-beer-druthers.png');
    msg.setTimestamp();
    msg.setFooter('CODE BAR', 'http://volimpivo.ba/wordpress/wp-content/uploads/2017/04/bordinos-beer-druthers.png');

    const prikazyZaklad = `
      '${prefix}help' - Zobrazí tuto nápovědu`;

    const prikazyRaid = `
      '${prefix}raid' - Vypíše seznam příkazů pro RAID Shadow Legends.
      '${prefix}raid hero (název hrdiny)' - Vypíše hodnocení hrdiny.`;

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
