class Asset {
  constructor(name, id, location, faction, maxHp, currentHp) {
    this.name = name;
    this.id = id;
    this.location = location;
    this.faction = faction;
    this.maxHp = maxHp;
    this.currentHp = currentHp ? currentHp : maxHp;
  }
}
module.exports = Asset;
