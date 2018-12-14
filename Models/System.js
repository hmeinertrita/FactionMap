const Region = require('./Region.js');
const Asset = require('./Asset.js');

class System extends Region.CompositeRegion {
  constructor(name, stars, factions, assets, ...deepSpaceRegions) {
    super(...stars, ...deepSpaceRegions);
    this.name = name;
    this.factions = factions;
    this.stars = stars;
    this.assets = assets ? assets : {};
    this.deepSpaceRegions = deepSpaceRegions;
    this.allLocations = this.getLocations();
  }

  newAsset(name, callsign, locationName, factionColour, maxHp) {
    const id = Object.keys(this.assets).length;
    const asset = new Asset(id, name, callsign, locationName, this.factions[factionColour], maxHp, maxHp);
    this.assets[id] = asset;
  }
}

module.exports = System;
