const Region = require('./Region.js');

class Orbital extends Region.RegionAndLocation {
  constructor(ring, name, ...planets) {
    super(name, ...planets);
    this.ring = ring;
  }
}

module.exports = Orbital;
