declare module 'databaseInterface' {

  /** Řádek z raid_heroes tabulky */
  export interface RaidHeroRow {
    id: number,
    faction: string,
    name: string,
    rarity: string,
    element: string,
    typ: string,
    overal: string,
    campaign: string,
    arena_off: string,
    arena_def: string,
    boss: string,
    boss_gs: string,
    ice_g: string,
    dragon: string,
    spider: string,
    fk: string,
    mino: string,
    force: string,
    magic: string,
    spirit: string,
    void: string,
  }
}
