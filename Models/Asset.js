class Asset {
  constructor(name, id, locationName, faction, maxHp, currentHp) {
    this.name = name;
    this.id = id;
    this.locationName = locationName;
    this.faction = faction;
    this.maxHp = maxHp;
    this.currentHp = currentHp ? currentHp : maxHp;
  }
}
module.exports = Asset;
