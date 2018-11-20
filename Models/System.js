class System {
  constructor(name, stars, factions, assets) {
    this.name = name;
    this.factions = factions;
    this.stars = stars;
    this.assets = assets ? assets : {};
  }

  newAsset(name, id, location, factionColour, maxHp) {
    this.assets[id] = new Asset(name, id, location, this.factions[factionColour], maxHp);
  }

  removeAsset(id) {
    delete this.assets[id];
  }
}

module.exports = System;
