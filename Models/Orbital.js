const Location = require('./Location.js');

class Orbital extends Location {
  constructor(ring, id, name, ...planets) {
    super(id, name, ...planets);
    this.ring = ring;
  }
}

module.exports = Orbital;
