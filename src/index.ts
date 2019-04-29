/* #region IMPORTY */
///<reference path="declaration/index.d.ts"/>
///<reference path="../node_modules/discord.js/typings/index.d.ts"/>
import { Message, TextChannel, RichEmbed } from "discord.js";
import { RaidHeroRow } from 'databaseInterface';
const Discord = require('discord.js');
const { prefix, token, } = require('./config.json');
const client = new Discord.Client();
const sqlite3 = require('sqlite3').verbose();
/* #endregion */

/* #region ON BOT STARTED */
client.on('ready', () => {
  log('Code Bar BOT started!', 'info');
});
/* #endregion */

/* #region ZÁKLADNÍ NASTAVENÍ */
let isWellcomeMsg = false;
/* #endregion */

/* #region OPEN DB */
let db = new sqlite3.Database('./db/codeBar.db', sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    log(err.message, 'error');
  } else {
    log('Připojen k db/codeBar.db', 'database');
  }
});
/* #endregion */

/* #region WELLCOME MSG */
let wmInfoText = '';
wmInfoText += 'V současné chvíli hledáme **RANGED** dps:';
wmInfoText += '\nDruid(1), Hunter(1), Mage(1), Priest(2), Shaman(2), Warlock(1)';
wmInfoText += '\n[Přihláška do guildy](http://www.guilded.gg/r/zzWloQxpwj)';
wmInfoText += '\n\n**RAID TIME** vždy __19:00 - 22:00__';
wmInfoText += '\n**Lichý týden**: *Středa, Čtvrtek a Neděle*';
wmInfoText += '\n**Sudý týden**: *Pátek, Sobota a Neděle*';

let wmOdkazyText = '';
wmOdkazyText += '[WEB Dark Legions(bude nahrazen aplikaci GUILDED )](http://dl.wowlaunch.com/)';
wmOdkazyText += '\n[Guilded - Stránka guildy](https://www.guilded.gg/Dark-Legions-CZSK)';
wmOdkazyText += '\n[Guilded - Přihláška do guildy](http://www.guilded.gg/r/zzWloQxpwj)';
wmOdkazyText += '\n[WoWProgres](https://www.wowprogress.com/guild/eu/drak-thul/Dark+Legions)';
wmOdkazyText += '\n[Raider.IO](https://raider.io/guilds/eu/drakthul/Dark%20Legions?utm_source=discord&utm_medium=notification)';

let wmProClenyText = '';
wmProClenyText += '**!authorize** - přijde vám do zprávy link na authorizaci na Bnet';
wmProClenyText += '\n**!toon set-main "characterName" "server"** - nastaví main postavu';
wmProClenyText += '\n - příklad: *!toon set-main Rreit drakthul*';
wmProClenyText += '\nPříkaz napište v místnosti wellcome.';
wmProClenyText += '\n* __Po autorizaci se vám zpřístupní další funkce.__';

const wellcomeMsg: RichEmbed = new Discord.RichEmbed();
wellcomeMsg
  .setColor('#ff0000')
  .setTitle('Dark Legions')
  .setDescription('Vítáme Vás na DICORDU guildy Dark Legions')
  .setThumbnail('http://volimpivo.ba/wordpress/wp-content/uploads/2017/04/bordinos-beer-druthers.png')
  .setTimestamp(null)
  .addBlankField()
  .addField('Info', wmInfoText)
  .addBlankField()
  .addField('Odkazy', wmOdkazyText)
  .addBlankField()
  .addField('Pro členy Dark legions', wmProClenyText)
  .setFooter('Vedení guildy Dark Legions', 'http://volimpivo.ba/wordpress/wp-content/uploads/2017/04/bordinos-beer-druthers.png');
/* #endregion */

/* #region Messages HELP */
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
/* #endregion */

/* #region ON MESSAGE */
client.on('message', message => {

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
  messageInfo(message);

  // Získání commandu
  const args = message.content.slice(prefix.length).split(' ');
  let command = args.shift().toLowerCase();

  // Vypisuje commandy
  log(`Command > ${command}`);

  // Command help
  if (command === 'help') {
    message.channel.send(`<@!${message.author.id}>, Zde je seznam příkazů.`);
    message.channel.send(helpMsg);
    return;
  }

  // Command raid
  if (command === 'raid') {
    command = args.shift();
    log(`Command > raid > ${command}`);
    if (command === undefined) {
      message.channel.send(`<@!${message.author.id}>, Zde je seznam příkazů pro raid.`);
      message.channel.send(helpRaid);
      return;
    }

    // Command raid hero
    if (command === 'hero') {
      command = args.shift();
      log(`Command > raid > hero > ${command}`);
      const query = 'SELECT * FROM raid_heroes WHERE name LIKE \'%' + command + '%\'';
      log('query = ' + query, 'database')
      db.all(query, [], (err, rows: RaidHeroRow[]) => {
        if (err) {
          log(err.message, 'error');
          message.channel.send(`<@!${message.author.id}>, Došlo k chybě :-(.`);
          return;
        }
        if (rows != undefined) {
          if (rows.length > 1) {
            let hrdinove: string = '';
            for (let i = 0; i < rows.length; i++) {
              hrdinove += rows[i].name + ', ';
            }
            log(`Specifikuj hrdinu, nalezl jsem: ${hrdinove}`, 'database');
            message.channel.send(`<@!${message.author.id}>, Specifikuj hrdinu, nalezl jsem: ${hrdinove}`);
            return;
          } else {
            log('Nalezen hrdina: ' + rows[0].name, 'database');
            sendHeroInfo(rows[0], message);
            return;
          }
        } else {
          log(`Hrdinu '${command}' jsem v databázi nenašel.`, 'database');
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
});
/* #endregion */

/* #region ON NEW MEMBER */
client.on('guildMemberAdd', member => {
  // Odešle nově příchozím zprávu, pokud je nastaveno
  if (isWellcomeMsg) {
    member.send(wellcomeMsg);
  }
});
/* #endregion */

/* #region Funkce */

/** Vypíše do konzole informace o zprávě
 * @param message discord message object
 */
function messageInfo(message: Message): void {
  const textChannel = <TextChannel>message.channel;
  const msg = `Message:\nAutor   > ${message.author.username} - (${message.author.id})\nServer  > ${message.guild.name} - (${message.guild.id})\nChannel > ${textChannel.name} - (${textChannel.id})\nMessage > (${message.id}) - "${message.content}"`;
  log(msg);
}
/** Vymaže zprávu po 10000 ms pokud splňuje podmínku 
 * @param message discord message object
 */
function deleteMessage(message: Message): void {
  const msg = `BOT > Mažu zprávu ID: ${message.id}`;
  console.log(msg);
  message.delete(10000);
}

/** Vypíše informace o hrdinovy
 * @param row řádek z tabulky raid_heroes
 * @param message discord Message object
 */
function sendHeroInfo(row: RaidHeroRow, message: Message): void {
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
/* #endregion */

/* #region LOGER */
function log(msg: string, type?: 'info' | 'database' | 'warning' | 'error', important?: boolean) {
  const info = 'color: blue;';
  const database = 'color: green;';
  const warning = 'text-decoration: underline;';
  const error = 'background: red; text-decoration: underline;';
  const dulezite = ' font-weight: bold;';
  const impMsg = important || type === 'error' ? '>>> ' : '';
  let style: string;
  switch (type) {
    case 'info':
      style = info;
      break;
    case 'database':
      style = database;
      break;
    case 'warning':
      style = warning;
      break;
    case 'error':
      style = error;
      break;
    default:
      style = info;
      break;
  }
  if (important || type === 'error') {
    style += dulezite;
  }
  console.log(impMsg + '%c' + msg + '\n', style);
}
/* #endregion */

/* #region LOG IN */
client.login(token);
/* #endregion */