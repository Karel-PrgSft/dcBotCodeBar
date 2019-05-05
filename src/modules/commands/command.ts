///<reference path="../../../node_modules/discord.js/typings/index.d.ts"/>

import { Message, RichEmbed } from 'discord.js';
import { Loger } from '../loger';
import { Utils } from '../utils';
const Discord = require('discord.js');
require('dotenv/config');

export class Command {

  public loger: Loger;
  public utils: Utils;
  public ritchEmbed: RichEmbed;
  private prefix = process.env.PREFIX;

  constructor(
    public message: Message,
    public args?: string[],
    public send?: boolean,
  ) {
    this.loger = new Loger();

    this.utils = new Utils();

    this.ritchEmbed = new RichEmbed();
    this.ritchEmbed
      .setColor('#ff0000')
      .setThumbnail('http://volimpivo.ba/wordpress/wp-content/uploads/2017/04/bordinos-beer-druthers.png')
      // .setThumbnail('attachment://test.png')
      .setTimestamp()
      .setFooter('CODE BAR', 'http://volimpivo.ba/wordpress/wp-content/uploads/2017/04/bordinos-beer-druthers.png');

    if (send === true) {
      this.vyhodnotCommand();
    }
  }

  /** Vyhodnotí HELP command a pošle nápovědu. */
  private vyhodnotCommand() {
    const subCommand = this.args === null ? '' : this.args.shift();
    this.loger.log(`Command > help > ${subCommand}`);

    if (subCommand === 'raid') {
      this.sendMsgHelp(this.getMsgType('helpRaid'), 'zde je seznam příkazů pro raid.');
      return;
    }

    if (subCommand === undefined) {
      /*
      const file = new Discord.Attachment('c:/Projekty/CodeBarBot/src/images/test.png');
      this.message.channel.send({ files: [file], embed: this.getMsgType('help') });
      */
      this.sendMsgHelp(this.getMsgType('help'));
      return;
    }

    this.sendMsgHelp(this.getMsgType('help'), 'příkaz nerozpoznán! Zde je seznam příkazů.');
  }

  /** Odešle nápovědu k příkazům.
   * @param msg getMsgType();
   * @param text default: 'Zde je seznam příkazů.'
   */
  public sendMsgHelp(msg: RichEmbed, text?: string) {
    this.message.channel.send(`<@!${this.message.author.id}>, ${text !== undefined ? text : 'zde je seznam příkazů.'}`);
    this.message.channel.send(msg);
  }

  /** Vrátí tělo zprávy podle typu.
   * @param type Zvol typ nápovědy.
   * @returns Discord object RichEmbed (stylyzovaná zpráva)
   */
  public getMsgType(type: 'help' | 'helpRaid'): RichEmbed {
    const msg: RichEmbed = new Discord.RichEmbed(this.ritchEmbed);
    const prikazyZaklad = `'${this.prefix}help' - Zobrazí tuto nápovědu`;
    const prikazyRaid = `'${this.prefix}raid' - Vypíše seznam příkazů pro RAID Shadow Legends.
      '${this.prefix}raid hero (název hrdiny)' - Vypíše hodnocení hrdiny.`;

    switch (type) {
      case 'help':
        msg
          .addField('Základní příkazy', prikazyZaklad)
          .addField('Příkazy pro RAID', prikazyRaid);
        break;
      case 'helpRaid':
        msg.addField('Příkazy pro RAID', prikazyRaid);
        break;
    }
    return msg;
  }
}
