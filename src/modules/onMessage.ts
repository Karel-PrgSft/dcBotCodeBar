///<reference path="../../node_modules/discord.js/typings/index.d.ts"/>
import { Message, TextChannel, RichEmbed } from "discord.js";
import { Loger } from './loger';
import { DataService, RaidHeroRow } from './dataService';
const Discord = require('discord.js');
const { prefix } = require('../config.json');

let prikazyZaklad = '';
prikazyZaklad += '`' + prefix + 'help` - Zobrazí tuto nápovědu';

let prikazyRaid = '';
prikazyRaid += '`' + prefix + 'raid` - Vypíše seznam příkazů pro RAID Shadow Legends.';
prikazyRaid += '\n`' + prefix + 'raid hero (název hrdiny)` - Vypíše hodnocení hrdiny.';

const helpMsg: RichEmbed = new Discord.RichEmbed();
helpMsg
  .setColor('#ff0000')
  .setThumbnail('http://volimpivo.ba/wordpress/wp-content/uploads/2017/04/bordinos-beer-druthers.png')
  .addField('Základní příkazy', prikazyZaklad)
  .addField('Příkazy pro RAID', prikazyRaid)
  .setTimestamp()
  .setFooter('CODE BAR', 'http://volimpivo.ba/wordpress/wp-content/uploads/2017/04/bordinos-beer-druthers.png');

const helpRaid: RichEmbed = new Discord.RichEmbed();
helpRaid
  .setColor('#ff0000')
  .setThumbnail('http://volimpivo.ba/wordpress/wp-content/uploads/2017/04/bordinos-beer-druthers.png')
  .addField('Příkazy pro RAID', prikazyRaid)
  .setTimestamp()
  .setFooter('CODE BAR', 'http://volimpivo.ba/wordpress/wp-content/uploads/2017/04/bordinos-beer-druthers.png');

export class OnMessage {

  private loger = new Loger;

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

    // Command help
    if (command === 'help') {
      message.channel.send(`<@!${message.author.id}>, Zde je seznam příkazů.`);
      message.channel.send(helpMsg);
      return;
    }

    // Command raid
    if (command === 'raid') {
      command = args.shift();
      this.loger.log(`Command > raid > ${command}`);
      if (command === undefined) {
        message.channel.send(`<@!${message.author.id}>, Zde je seznam příkazů pro raid.`);
        message.channel.send(helpRaid);
        return;
      }

      // Command raid hero
      if (command === 'hero') {
        command = args.shift();
        this.loger.log(`Command > raid > hero > ${command}`);
        let data = new DataService();
        data.db.all(data.getQueryFindHero(command), [], (err, rows: RaidHeroRow[]) => {
          if (err) {
            this.loger.log(err.message, 'error');
            message.channel.send(`<@!${message.author.id}>, Došlo k chybě :-(.`);
            return;
          }
          if (rows != undefined) {
            if (rows.length > 1) {
              let hrdinove: string = '';
              for (let i = 0; i < rows.length; i++) {
                hrdinove += rows[i].name + ', ';
              }
              this.loger.log(`Specifikuj hrdinu, nalezl jsem: ${hrdinove}`, 'database');
              message.channel.send(`<@!${message.author.id}>, Specifikuj hrdinu, nalezl jsem: ${hrdinove}`);
              return;
            } else {
              this.loger.log('Nalezen hrdina: ' + rows[0].name, 'database');
              this.sendHeroInfo(rows[0], message);
              return;
            }
          } else {
            this.loger.log(`Hrdinu '${command}' jsem v databázi nenašel.`, 'database');
            message.channel.send(`<@!${message.author.id}>, Hrdinu '${command}' jsem v databázi nenašel.`);
          }
        });
        return;
      }
      message.channel.send(`<@!${message.author.id}>, příkaz nerozpoznán! Zde je seznam příkazů pro raid.`);
      message.channel.send(helpRaid);
      return;
    }
    message.channel.send(`<@!${message.author.id}>, příkaz nerozpoznán! Zde je seznam příkazů.`);
    message.channel.send(helpMsg);
  }

  /** Vypíše do konzole informace o zprávě
   * @param message discord message object
   */
  messageInfo(message: Message): void {
    const textChannel = <TextChannel>message.channel;
    const msg = `Message:\nAutor   > ${message.author.username} - (${message.author.id})\nServer  > ${message.guild.name} - (${message.guild.id})\nChannel > ${textChannel.name} - (${textChannel.id})\nMessage > (${message.id}) - "${message.content}"`;
    this.loger.log(msg);
  }
  /** Vymaže zprávu po 10000 ms pokud splňuje podmínku 
   * @param message discord message object
   */
  deleteMessage(message: Message): void {
    const msg = `BOT > Mažu zprávu ID: ${message.id}`;
    this.loger.log(msg);
    message.delete(10000);
  }

  /** Vypíše informace o hrdinovy
   * @param row řádek z tabulky raid_heroes
   * @param message discord Message object
   */
  sendHeroInfo(row: RaidHeroRow, message: Message): void {
    let heroInfo = '';
    heroInfo += `${row.faction} - ${row.element} - ${row.rarity} - ${row.typ}\n`;
    heroInfo += `${row.overal.length > 0 ? 'Overal: **' + row.overal + '**\n' : ''}`;
    heroInfo += `${row.campaign.length > 0 ? 'Campaign: **' + row.campaign + '**\n' : ''}`;
    heroInfo += `${row.arena_off.length > 0 ? 'Arena OFF: **' + row.arena_off + '** ' : ''}`;
    heroInfo += `${row.arena_def.length > 0 ? 'Arena DEF: **' + row.arena_def + '**\n' : ''}`;
    heroInfo += `${row.boss.length > 0 ? 'Clan BOSS: **' + row.boss + '** ' : ''}`;
    heroInfo += `${row.boss_gs.length > 0 ? 'Clan BOSS + GS: **' + row.boss_gs + '**\n' : '\n'}`;
    heroInfo += `${row.ice_g.length > 0 ? 'Ice Golem: **' + row.ice_g + '** ' : ''}`;
    heroInfo += `${row.dragon.length > 0 ? 'Dragon: **' + row.dragon + '** ' : ''}`;
    heroInfo += `${row.fk.length > 0 ? 'Fire Knight: **' + row.fk + '** ' : ''}`;
    heroInfo += `${row.spider.length > 0 ? 'Spider: **' + row.spider + '** ' : ''}`;
    heroInfo += `${row.mino.length > 0 ? 'Minotaur: **' + row.mino + '**\n' : ''}`;
    heroInfo += `${row.force.length > 0 ? 'FORCE: **' + row.force + '** ' : ''}`;
    heroInfo += `${row.magic.length > 0 ? 'MAGIC: **' + row.magic + '** ' : ''}`;
    heroInfo += `${row.spirit.length > 0 ? 'SPIRIT: **' + row.spirit + '** ' : ''}`;
    heroInfo += `${row.void.length > 0 ? 'VOID: **' + row.void + '**\n \n' : '\n'}`;
    heroInfo += `Data jsem vzal z dokumentu __[zde](https://docs.google.com/spreadsheets/d/1jdrS8mnsITEWL1qREShSG3xNOZKYJuL5dUnNrUWQIjw/htmlview?usp=sharing&sle=true)__.\n`;

    let color: string;
    switch (row.element) {
      case 'Magic':
        color = '#0000ff';
        break
      case 'Spirit':
        color = '#008000';
        break
      case 'Force':
        color = '#ff0000';
        break
      case 'Void':
        color = '#800080';
        break
    }

    const hero: RichEmbed = new Discord.RichEmbed();
    hero
      .setColor(color)
      .setThumbnail('http://volimpivo.ba/wordpress/wp-content/uploads/2017/04/bordinos-beer-druthers.png')
      .addField(row.name, heroInfo)
      .setTimestamp()
      .setFooter('CODE BAR', 'http://volimpivo.ba/wordpress/wp-content/uploads/2017/04/bordinos-beer-druthers.png');

    message.channel.send(`<@!${message.author.id}>, Našel jsem hrdinu: ${row.name}`);
    message.channel.send(hero);
  }
}