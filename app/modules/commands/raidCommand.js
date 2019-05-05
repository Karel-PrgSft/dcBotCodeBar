"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const command_1 = require("./command");
const Discord = require('discord.js');
class RaidCommand extends command_1.Command {
    constructor(ds, messageR, argsR) {
        super(messageR, argsR);
        this.ds = ds;
        this.messageR = messageR;
        this.argsR = argsR;
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
    findHero(hero) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const rows = yield this.ds.rRaid_heroes.get().then((snapshot) => {
                const results = [];
                snapshot.forEach(doc => {
                    const result = doc.data();
                    const name = result.name.toLowerCase();
                    if (name.indexOf(hero) >= 0) {
                        results.push(doc.data());
                    }
                });
                return results;
            }).catch(err => {
                console.log('Error getting documents', err);
            });
            if (rows.length === 1) {
                this.loger.log('Nalezen hrdina: ' + rows[0].name, 'database');
                this.sendHeroInfo(rows[0]);
                return;
            }
            else if (rows.length > 1) {
                let hrdinove = '';
                for (let i = 0; i < rows.length; i++) {
                    hrdinove += rows[i].name;
                    if (i + 1 !== rows.length) {
                        hrdinove += ', ';
                    }
                }
                this.loger.log(`Specifikuj hrdinu, nalezl jsem: ${hrdinove}`, 'database');
                this.message.channel.send(`<@!${this.message.author.id}>, Specifikuj hrdinu, nalezl jsem: ${hrdinove}`);
            }
            else {
                this.loger.log(`Hrdinu '${hero}' jsem v databázi nenašel.`, 'database');
                this.message.channel.send(`<@!${this.message.author.id}>, Hrdinu '${hero}' jsem v databázi nenašel.`);
            }
        });
    }
    sendHeroInfo(row) {
        const heroInfo = `${row.faction} - ${row.element} - ${row.rarity} - ${row.typ}
      ${this.utils.notEmpty(row.overal) ? 'Overal: **' + row.overal + '**' : ''} ${this.utils.notEmpty(row.campaign) ? 'Campaign: **' + row.campaign + '**' : ''}
      ${this.utils.notEmpty(row.arena_off) ? 'Arena OFF: **' + row.arena_off + '** ' : ''} ${this.utils.notEmpty(row.arena_def) ? 'Arena DEF: **' + row.arena_def + '**' : ''}
      ${this.utils.notEmpty(row.boss) ? 'Clan BOSS: **' + row.boss + '** ' : ''} ${this.utils.notEmpty(row.boss_gs) ? 'Clan BOSS + GS: **' + row.boss_gs + '**' : ''}
      ${this.utils.notEmpty(row.ice_g) ? 'Ice Golem: **' + row.ice_g + '** ' : ''} ${this.utils.notEmpty(row.dragon) ? 'Dragon: **' + row.dragon + '** ' : ''} ${this.utils.notEmpty(row.fk) ? 'Fire Knight: **' + row.fk + '** ' : ''} ${this.utils.notEmpty(row.spider) ? 'Spider: **' + row.spider + '** ' : ''} ${this.utils.notEmpty(row.mino) ? 'Minotaur: **' + row.mino + '**' : ''}
      ${this.utils.notEmpty(row.force) ? 'FORCE: **' + row.force + '** ' : ''} ${this.utils.notEmpty(row.magic) ? 'MAGIC: **' + row.magic + '** ' : ''} ${this.utils.notEmpty(row.spirit) ? 'SPIRIT: **' + row.spirit + '** ' : ''} ${this.utils.notEmpty(row.void) ? 'VOID: **' + row.void + '**' : ''}
      ${this.utils.notEmpty(row.drop) ? 'Padá v kampani: **' + row.drop + '** ' : ''}
      Data jsem vzal z dokumentu __[zde](https://docs.google.com/spreadsheets/d/1jdrS8mnsITEWL1qREShSG3xNOZKYJuL5dUnNrUWQIjw/htmlview?usp=sharing&sle=true)__.`;
        let color;
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
        const hero = new Discord.RichEmbed(this.ritchEmbed);
        hero
            .setColor(color)
            .addField(row.name, heroInfo);
        this.message.channel.send(`<@!${this.message.author.id}>, Našel jsem hrdinu: ${row.name}`);
        this.message.channel.send(hero);
    }
}
exports.RaidCommand = RaidCommand;
