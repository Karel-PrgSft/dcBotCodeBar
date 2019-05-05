"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
const sqlite3 = require('sqlite3').verbose();
const firebase = require('firebase/app');
const FielsValue = require('firebase-admin').firestore.FieldValue;
const admin = require('firebase-admin');
const serviceAccount = require('../../serviceAccount.json');
class DataService {
    constructor() {
        this.utils = new utils_1.Utils();
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
        this.fb = admin.firestore();
        this.rRaid_heroes = this.fb.collection('raid_heroes');
    }
}
exports.DataService = DataService;
