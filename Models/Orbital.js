const Region = require('./Region.js');

class Orbital extends Region.RegionAndLocation {
  constructor(ring, region, name, ...planets) {
    super(name, region, ...planets);
    this.ring = ring;
  }
}

module.exports = Orbital;
