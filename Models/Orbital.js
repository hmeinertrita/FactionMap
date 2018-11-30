const Location = require('./Location.js');

class Orbital extends Location {
  constructor(ring, name, ...planets) {
    super(name, ...planets);
    this.ring = ring;
  }
}

module.exports = Orbital;
