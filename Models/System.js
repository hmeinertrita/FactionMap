class System {
  constructor(name, stars, factions, assets, ...deepSpace) {
    this.name = name;
    this.factions = factions;
    this.stars = stars;
    this.assets = assets ? assets : {};
    this.deepSpace = deepSpace;
  }

  newAsset(name, id, location, factionColour, maxHp) {
    this.assets[id] = new Asset(name, id, location, this.factions[factionColour], maxHp);
  }

  removeAsset(id) {
    delete this.assets[id];
  }
}

module.exports = System;
