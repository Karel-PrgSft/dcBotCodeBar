///<reference path="../../../node_modules/discord.js/typings/index.d.ts"/>

import { Message, RichEmbed } from 'discord.js';
import { DataService, RaidHeroRow } from '../dataService';
import { Command } from './command';
const Discord = require('discord.js');

export class RaidCommand extends Command {

  constructor(
    private messageR: Message,
    private argsR?: string[],
  ) {
    super(messageR, argsR);
    if (this.args !== undefined) {
      let subCommand = this.args === null ? '' : this.args.shift();
      this.loger.log(`Command > raid > ${subCommand}`);
      if (subCommand === 'hero') {
        subCommand = this.args.shift();
        if (subCommand === undefined) {
          this.message.channel.send(`<@!${this.message.author.id}>, Zadej jméno hrdiny. např.: 'code~raid hero Executioner'`);
          return;
        }
        this.loger.log(`Command > raid > hero > ${subCommand}`);
        this.findHero(subCommand);
        return;
      }
      if (subCommand === undefined) {
        this.sendMsgHelp(this.getMsgType('helpRaid'), 'Zde je seznam příkazů pro raid.');
        return;
      }
      this.sendMsgHelp(this.getMsgType('helpRaid'), 'příkaz nerozpoznán! Zde je seznam příkazů pro raid.');
    }
  }

  /** Vyhledá hrdinu v DB
   * @param hero Název hrdiny
   */
  private findHero(hero: string): void {
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
        } else if (rows[0] !== undefined) {
          this.loger.log('Nalezen hrdina: ' + rows[0].name, 'database');
          this.sendHeroInfo(rows[0]);
          return;
        }
      } else {
        this.loger.log(`Hrdinu '${hero}' jsem v databázi nenašel.`, 'database');
        this.message.channel.send(`<@!${this.message.author.id}>, Hrdinu '${hero}' jsem v databázi nenašel.`);
      }
    });
    data.db.close();
  }

  /** Vypíše informace o hrdinovy
   * @param row řádek z tabulky raid_heroes
   */
  private sendHeroInfo(row: RaidHeroRow): void {
    const heroInfo = `${row.faction} - ${row.element} - ${row.rarity} - ${row.typ}
      ${row.overal.length > 0 ? 'Overal: **' + row.overal + '**' : ''} ${row.campaign.length > 0 ? 'Campaign: **' + row.campaign + '**' : ''}
      ${row.arena_off.length > 0 ? 'Arena OFF: **' + row.arena_off + '** ' : ''} ${row.arena_def.length > 0 ? 'Arena DEF: **' + row.arena_def + '**' : ''}
      ${row.boss.length > 0 ? 'Clan BOSS: **' + row.boss + '** ' : ''} ${row.boss_gs.length > 0 ? 'Clan BOSS + GS: **' + row.boss_gs + '**' : ''}
      ${row.ice_g.length > 0 ? 'Ice Golem: **' + row.ice_g + '** ' : ''} ${row.dragon.length > 0 ? 'Dragon: **' + row.dragon + '** ' : ''} ${row.fk.length > 0 ? 'Fire Knight: **' + row.fk + '** ' : ''} ${row.spider.length > 0 ? 'Spider: **' + row.spider + '** ' : ''} ${row.mino.length > 0 ? 'Minotaur: **' + row.mino + '**' : ''}
      ${row.force.length > 0 ? 'FORCE: **' + row.force + '** ' : ''} ${row.magic.length > 0 ? 'MAGIC: **' + row.magic + '** ' : ''} ${row.spirit.length > 0 ? 'SPIRIT: **' + row.spirit + '** ' : ''} ${row.void.length > 0 ? 'VOID: **' + row.void + '**' : ''}

      Data jsem vzal z dokumentu __[zde](https://docs.google.com/spreadsheets/d/1jdrS8mnsITEWL1qREShSG3xNOZKYJuL5dUnNrUWQIjw/htmlview?usp=sharing&sle=true)__.`;

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

    const hero: RichEmbed = new Discord.RichEmbed(this.ritchEmbed);
    hero
      .setColor(color)
      .addField(row.name, heroInfo);

    this.message.channel.send(`<@!${this.message.author.id}>, Našel jsem hrdinu: ${row.name}`);
    this.message.channel.send(hero);
  }
}
