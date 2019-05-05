"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const loger_1 = require("./loger");
const sqlite3 = require('sqlite3').verbose();
const firebase = require('firebase/app');
const FielsValue = require('firebase-admin').firestore.FieldValue;
const admin = require('firebase-admin');
const serviceAccount = require('../../serviceAccount.json');
class DataService {
    constructor() {
        this.loger = new loger_1.Loger();
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
        this.fb = admin.firestore();
        this.rRaid_heroes = this.fb.collection('raid_heroes');
    }
}
exports.DataService = DataService;
