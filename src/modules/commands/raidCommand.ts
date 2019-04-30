///<reference path="../../../node_modules/discord.js/typings/index.d.ts"/>

import { Message, RichEmbed } from 'discord.js';
import { DataService, RaidHeroRow } from '../dataService';
import { Loger } from '../loger';
import { HelpCommand } from './helpCommand';
const Discord = require('discord.js');

export class RaidCommand {

  private loger = new Loger();

  constructor(
    private message: Message,
    private args?: string[],
  ) {
    if (args !== undefined) {
      let subCommand = args.shift();
      this.loger.log(`Command > raid > ${subCommand}`);
      if (subCommand === 'hero') {
        subCommand = args.shift();
        if (subCommand === undefined) {
          this.message.channel.send(`<@!${this.message.author.id}>, Zadej jméno hrdiny. např.: 'code~raid hero Executioner'`);
          return;
        }
        this.loger.log(`Command > raid > hero > ${subCommand}`);
        this.findHero(subCommand);
        return;
      }
      const helpMsg = new HelpCommand(this.message);
      if (subCommand === undefined) {
        helpMsg.sendMsgHelp(helpMsg.getMsgType('helpRaid'), this.message, 'Zde je seznam příkazů pro raid.');
        return;
      }
      helpMsg.sendMsgHelp(helpMsg.getMsgType('helpRaid'), this.message, 'příkaz nerozpoznán! Zde je seznam příkazů pro raid.');
    }
  }

  /** Vyhledá hrdinu v DB
   * @param hero Název hrdiny
   */
  findHero(hero: string) {
    const data = new DataService();
    data.db.all(data.getQueryFindHero(hero), [], (err, rows: RaidHeroRow[]) => {
      if (err) {
        this.loger.log(err.message, 'error');
        this.message.channel.send(`<@!${this.message.author.id}>, Došlo k chybě :-(.`);
        return;
      }
      if (rows !== undefined) {
        if (rows.length > 1) {
          let hrdinove = '';
          for (let i = 0; i < rows.length; i++) {
            hrdinove += rows[i].name + ', ';
          }
          this.loger.log(`Specifikuj hrdinu, nalezl jsem: ${hrdinove}`, 'database');
          this.message.channel.send(`<@!${this.message.author.id}>, Specifikuj hrdinu, nalezl jsem: ${hrdinove}`);
          return;
        } else {
          this.loger.log('Nalezen hrdina: ' + rows[0].name, 'database');
          this.sendHeroInfo(rows[0], this.message);
          return;
        }
      } else {
        this.loger.log(`Hrdinu '${hero}' jsem v databázi nenašel.`, 'database');
        this.message.channel.send(`<@!${this.message.author.id}>, Hrdinu '${hero}' jsem v databázi nenašel.`);
      }
    });
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
        break;
      case 'Spirit':
        color = '#008000';
        break;
      case 'Force':
        color = '#ff0000';
        break;
      case 'Void':
        color = '#800080';
        break;
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
