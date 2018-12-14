class Asset {
  constructor(id, name, callsign, locationName, faction, maxHp, currentHp) {
    this.name = name;
    this.callsign = callsign;
    this.id = id;
    this.locationName = locationName;
    this.faction = faction;
    this.maxHp = maxHp;
    this.currentHp = currentHp ? currentHp : maxHp;
  }
}
module.exports = Asset;
