///<reference path="../../node_modules/@types/sqlite3/index.d.ts"/>

import { Loger } from './loger';
import { sqlite3, Database } from 'sqlite3';
const sqlite3: sqlite3 = require('sqlite3').verbose();

export class DataService {
  private loger = new Loger();
  public db: Database;

  constructor() {
    this.db = new sqlite3.Database('./db/codeBar.db', sqlite3.OPEN_READWRITE, (err) => {
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

  /** Vrátí query pro vyhledání hrdiny v tabulce raid_heroes
   * @param hero název hrdiny
   */
  public getQueryFindHero(hero: string): string {
    const query = `SELECT * FROM raid_heroes WHERE name LIKE '%${hero}%'`;
    this.loger.log('query = ' + query, 'database');
    return query;
  }
}

/** Objekt odpovídající řádku v raid_heroes */
export interface RaidHeroRow {
  id: number;
  faction: string;
  name: string;
  rarity: string;
  element: string;
  typ: string;
  overal: string;
  campaign: string;
  arena_off: string;
  arena_def: string;
  boss: string;
  boss_gs: string;
  ice_g: string;
  dragon: string;
  spider: string;
  fk: string;
  mino: string;
  force: string;
  magic: string;
  spirit: string;
  void: string;
}
