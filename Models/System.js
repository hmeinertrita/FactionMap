const Region = require('./Region.js');

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
}

module.exports = System;
