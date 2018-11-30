class Location {
  constructor(id, name, ...planets) {
    this.id = id;
    this.name = name;
    this.planets = planets;
  }
}

class Orbital extends Location {
  constructor(ring, id, name, ...planets) {
    super(id, name, ...planets);
    this.ring = ring;
  }
}

module.exports = Location;
