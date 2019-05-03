"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const loger_1 = require("./loger");
const sqlite3 = require('sqlite3').verbose();
const firebase = require('firebase/app');
const FielsValue = require('firebase-admin').firestore.FieldValue;
const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccount.json');
class DataService {
    constructor() {
        this.loger = new loger_1.Loger();

        /*
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
        const fb = admin.firestore();
        fb.collection('test').doc('123').set({
            'id': '123',
            'ebe': 'test',
        });
        */

        this.db = new sqlite3.Database('./db/codeBar.db', sqlite3.OPEN_READONLY, (err) => {
            if (err) {
                this.loger.log(err.message, 'error');
            } else {
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