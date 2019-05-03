"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const loger_1 = require("./loger");
const sqlite3 = require('sqlite3').verbose();
class DataService {
    constructor() {
        this.loger = new loger_1.Loger();
        this.db = new sqlite3.Database('https://karel-prgsft.github.io/dcBotCodeBar/db/codeBar.db', sqlite3.OPEN_READONLY, (err) => {
            if (err) {
                this.loger.log(err.message, 'error');
            }
            else {
                this.loger.log('Připojen k db/codeBar.db', 'database');
            }
        });
        this.db.on('close', () => {
            this.loger.log('Spojení s DB uzavřeno.', 'database');
        });
    }
    getQueryFindHero(hero) {
        const query = `SELECT * FROM raid_heroes WHERE name LIKE '%${hero}%'`;
        this.loger.log('query = ' + query, 'database');
        return query;
    }
}
exports.DataService = DataService;
