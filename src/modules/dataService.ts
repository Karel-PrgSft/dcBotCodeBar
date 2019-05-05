///<reference path="../../node_modules/@types/sqlite3/index.d.ts"/>
///<reference path="../../node_modules/firebase-admin/lib/index.d.ts"/>
///<reference path="../../node_modules/firebase/index.d.ts"/>

import { Utils } from './utils';
import { sqlite3, Database } from 'sqlite3';
import { Firestore, CollectionReference } from '@google-cloud/firestore';

const sqlite3: sqlite3 = require('sqlite3').verbose();
const firebase = require('firebase/app');
const FielsValue = require('firebase-admin').firestore.FieldValue;
const admin = require('firebase-admin');
const serviceAccount = require('../../serviceAccount.json');

export class DataService {
  private utils = new Utils();
  public fb: Firestore;
  public rRaid_heroes: CollectionReference;

  constructor() {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    this.fb = admin.firestore(); // TODO
    this.rRaid_heroes = this.fb.collection('raid_heroes');
  }
}

/** Objekt odpovídající řádku v raid_heroes */
export interface RaidHeroRow {
  'id'?: string;
  'faction'?: string;
  'name'?: string;
  'rarity'?: string;
  'element'?: string;
  'typ'?: string;
  'overal'?: string;
  'campaign'?: string;
  'arena_off'?: string;
  'arena_def'?: string;
  'boss'?: string;
  'boss_gs'?: string;
  'ice_g'?: string;
  'dragon'?: string;
  'spider'?: string;
  'fk'?: string;
  'mino'?: string;
  'force'?: string;
  'magic'?: string;
  'spirit'?: string;
  'void'?: string;
  'drop'?: string | undefined;
}
