const Region = require('./Region.js');

class Planet extends Region.Location {
  constructor(name, techLevel, faction) {
    super(name, "Planets");
    this.techLevel = techLevel;
    this.faction = faction;
  }
}

module.exports = Planet;
