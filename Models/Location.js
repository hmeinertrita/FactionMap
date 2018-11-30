class Location {
  constructor(id, name, ...planets) {
    this.id = id;
    this.name = name;
    this.planets = planets;
  }
}

module.exports = Location;
