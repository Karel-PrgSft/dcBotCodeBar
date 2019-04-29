var Discord = require('discord.js');
var _a = require('./config.json'), prefix = _a.prefix, token = _a.token;
var client = new Discord.Client();
var sqlite3 = require('sqlite3').verbose();
client.on('ready', function () {
    log('Code Bar BOT started!', 'info');
});
var isWellcomeMsg = false;
var db = new sqlite3.Database('./db/codeBar.db', sqlite3.OPEN_READWRITE, function (err) {
    if (err) {
        log(err.message, 'error');
    }
    else {
        log('Připojen k db/codeBar.db', 'database');
    }
});
var wmInfoText = '';
wmInfoText += 'V současné chvíli hledáme **RANGED** dps:';
wmInfoText += '\nDruid(1), Hunter(1), Mage(1), Priest(2), Shaman(2), Warlock(1)';
wmInfoText += '\n[Přihláška do guildy](http://www.guilded.gg/r/zzWloQxpwj)';
wmInfoText += '\n\n**RAID TIME** vždy __19:00 - 22:00__';
wmInfoText += '\n**Lichý týden**: *Středa, Čtvrtek a Neděle*';
wmInfoText += '\n**Sudý týden**: *Pátek, Sobota a Neděle*';
var wmOdkazyText = '';
wmOdkazyText += '[WEB Dark Legions(bude nahrazen aplikaci GUILDED )](http://dl.wowlaunch.com/)';
wmOdkazyText += '\n[Guilded - Stránka guildy](https://www.guilded.gg/Dark-Legions-CZSK)';
wmOdkazyText += '\n[Guilded - Přihláška do guildy](http://www.guilded.gg/r/zzWloQxpwj)';
wmOdkazyText += '\n[WoWProgres](https://www.wowprogress.com/guild/eu/drak-thul/Dark+Legions)';
wmOdkazyText += '\n[Raider.IO](https://raider.io/guilds/eu/drakthul/Dark%20Legions?utm_source=discord&utm_medium=notification)';
var wmProClenyText = '';
wmProClenyText += '**!authorize** - přijde vám do zprávy link na authorizaci na Bnet';
wmProClenyText += '\n**!toon set-main "characterName" "server"** - nastaví main postavu';
wmProClenyText += '\n - příklad: *!toon set-main Rreit drakthul*';
wmProClenyText += '\nPříkaz napište v místnosti wellcome.';
wmProClenyText += '\n* __Po autorizaci se vám zpřístupní další funkce.__';
var wellcomeMsg = new Discord.RichEmbed();
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
var prikazyZaklad = '';
prikazyZaklad += '`' + prefix + 'help` - Zobrazí tuto nápovědu';
var prikazyRaid = '';
prikazyRaid += '`' + prefix + 'raid` - Vypíše seznam příkazů pro RAID Shadow Legends.';
prikazyRaid += '\n`' + prefix + 'raid hero (název hrdiny)` - Vypíše hodnocení hrdiny.';
var helpMsg = new Discord.RichEmbed();
helpMsg
    .setColor('#ff0000')
    .setThumbnail('http://volimpivo.ba/wordpress/wp-content/uploads/2017/04/bordinos-beer-druthers.png')
    .addField('Základní příkazy', prikazyZaklad)
    .addField('Příkazy pro RAID', prikazyRaid)
    .setTimestamp()
    .setFooter('CODE BAR', 'http://volimpivo.ba/wordpress/wp-content/uploads/2017/04/bordinos-beer-druthers.png');
var helpRaid = new Discord.RichEmbed();
helpRaid
    .setColor('#ff0000')
    .setThumbnail('http://volimpivo.ba/wordpress/wp-content/uploads/2017/04/bordinos-beer-druthers.png')
    .addField('Příkazy pro RAID', prikazyRaid)
    .setTimestamp()
    .setFooter('CODE BAR', 'http://volimpivo.ba/wordpress/wp-content/uploads/2017/04/bordinos-beer-druthers.png');
client.on('message', function (message) {
    if (!message.content.startsWith(prefix) || message.author.bot) {
        return;
    }
    ;
    if (message.channel.type === 'dm') {
        message.author.send('Příkazy se dají použít pouze na servru.');
        return;
    }
    messageInfo(message);
    var args = message.content.slice(prefix.length).split(' ');
    var command = args.shift().toLowerCase();
    log("Command > " + command);
    if (command === 'help') {
        message.channel.send("<@!" + message.author.id + ">, Zde je seznam p\u0159\u00EDkaz\u016F.");
        message.channel.send(helpMsg);
        return;
    }
    if (command === 'raid') {
        command = args.shift();
        log("Command > raid > " + command);
        if (command === undefined) {
            message.channel.send("<@!" + message.author.id + ">, Zde je seznam p\u0159\u00EDkaz\u016F pro raid.");
            message.channel.send(helpRaid);
            return;
        }
        if (command === 'hero') {
            command = args.shift();
            log("Command > raid > hero > " + command);
            var query = 'SELECT * FROM raid_heroes WHERE name LIKE \'%' + command + '%\'';
            log('query = ' + query, 'database');
            db.all(query, [], function (err, rows) {
                if (err) {
                    log(err.message, 'error');
                    message.channel.send("<@!" + message.author.id + ">, Do\u0161lo k chyb\u011B :-(.");
                    return;
                }
                if (rows != undefined) {
                    if (rows.length > 1) {
                        var hrdinove = '';
                        for (var i = 0; i < rows.length; i++) {
                            hrdinove += rows[i].name + ', ';
                        }
                        log("Specifikuj hrdinu, nalezl jsem: " + hrdinove, 'database');
                        message.channel.send("<@!" + message.author.id + ">, Specifikuj hrdinu, nalezl jsem: " + hrdinove);
                        return;
                    }
                    else {
                        log('Nalezen hrdina: ' + rows[0].name, 'database');
                        sendHeroInfo(rows[0], message);
                        return;
                    }
                }
                else {
                    log("Hrdinu '" + command + "' jsem v datab\u00E1zi nena\u0161el.", 'database');
                    message.channel.send("<@!" + message.author.id + ">, Hrdinu '" + command + "' jsem v datab\u00E1zi nena\u0161el.");
                }
            });
            return;
        }
        message.channel.send("<@!" + message.author.id + ">, p\u0159\u00EDkaz nerozpozn\u00E1n! Zde je seznam p\u0159\u00EDkaz\u016F pro raid.");
        message.channel.send(helpRaid);
        return;
    }
    message.channel.send("<@!" + message.author.id + ">, p\u0159\u00EDkaz nerozpozn\u00E1n! Zde je seznam p\u0159\u00EDkaz\u016F.");
    message.channel.send(helpMsg);
});
client.on('guildMemberAdd', function (member) {
    if (isWellcomeMsg) {
        member.send(wellcomeMsg);
    }
});
function messageInfo(message) {
    var textChannel = message.channel;
    var msg = "Message:\nAutor   > " + message.author.username + " - (" + message.author.id + ")\nServer  > " + message.guild.name + " - (" + message.guild.id + ")\nChannel > " + textChannel.name + " - (" + textChannel.id + ")\nMessage > (" + message.id + ") - \"" + message.content + "\"";
    log(msg);
}
function deleteMessage(message) {
    var msg = "BOT > Ma\u017Eu zpr\u00E1vu ID: " + message.id;
    console.log(msg);
    message.delete(10000);
}
function sendHeroInfo(row, message) {
    var heroInfo = '';
    heroInfo += row.faction + " - " + row.element + " - " + row.rarity + " - " + row.typ + "\n";
    heroInfo += "" + (row.overal.length > 0 ? 'Overal: **' + row.overal + '**\n' : '');
    heroInfo += "" + (row.campaign.length > 0 ? 'Campaign: **' + row.campaign + '**\n' : '');
    heroInfo += "" + (row.arena_off.length > 0 ? 'Arena OFF: **' + row.arena_off + '** ' : '');
    heroInfo += "" + (row.arena_def.length > 0 ? 'Arena DEF: **' + row.arena_def + '**\n' : '');
    heroInfo += "" + (row.boss.length > 0 ? 'Clan BOSS: **' + row.boss + '** ' : '');
    heroInfo += "" + (row.boss_gs.length > 0 ? 'Clan BOSS + GS: **' + row.boss_gs + '**\n' : '\n');
    heroInfo += "" + (row.ice_g.length > 0 ? 'Ice Golem: **' + row.ice_g + '** ' : '');
    heroInfo += "" + (row.dragon.length > 0 ? 'Dragon: **' + row.dragon + '** ' : '');
    heroInfo += "" + (row.fk.length > 0 ? 'Fire Knight: **' + row.fk + '** ' : '');
    heroInfo += "" + (row.spider.length > 0 ? 'Spider: **' + row.spider + '** ' : '');
    heroInfo += "" + (row.mino.length > 0 ? 'Minotaur: **' + row.mino + '**\n' : '');
    heroInfo += "" + (row.force.length > 0 ? 'FORCE: **' + row.force + '** ' : '');
    heroInfo += "" + (row.magic.length > 0 ? 'MAGIC: **' + row.magic + '** ' : '');
    heroInfo += "" + (row.spirit.length > 0 ? 'SPIRIT: **' + row.spirit + '** ' : '');
    heroInfo += "" + (row.void.length > 0 ? 'VOID: **' + row.void + '**\n \n' : '\n');
    heroInfo += "Data jsem vzal z dokumentu __[zde](https://docs.google.com/spreadsheets/d/1jdrS8mnsITEWL1qREShSG3xNOZKYJuL5dUnNrUWQIjw/htmlview?usp=sharing&sle=true)__.\n";
    var color;
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
    var hero = new Discord.RichEmbed();
    hero
        .setColor(color)
        .setThumbnail('http://volimpivo.ba/wordpress/wp-content/uploads/2017/04/bordinos-beer-druthers.png')
        .addField(row.name, heroInfo)
        .setTimestamp()
        .setFooter('CODE BAR', 'http://volimpivo.ba/wordpress/wp-content/uploads/2017/04/bordinos-beer-druthers.png');
    message.channel.send("<@!" + message.author.id + ">, Na\u0161el jsem hrdinu: " + row.name);
    message.channel.send(hero);
}
function log(msg, type, important) {
    var info = 'color: blue;';
    var database = 'color: green;';
    var warning = 'text-decoration: underline;';
    var error = 'background: red; text-decoration: underline;';
    var dulezite = ' font-weight: bold;';
    var impMsg = important || type === 'error' ? '>>> ' : '';
    var style;
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
client.login(token);
//# sourceMappingURL=index.js.map