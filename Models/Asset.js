class Asset {
  constructor(name, faction, id, hp, loc) {
    this.name = name;
    this.faction = faction;
    this.id = id;
    this.maxHp = hp;
    this.currentHp = hp;
    this.location = loc;
  }
}
module.exports = Asset;
