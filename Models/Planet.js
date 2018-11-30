const Location = require('./Location.js');

class Planet extends Location {
  constructor(name, techLevel, faction) {
    super(name);
    this.techLevel = techLevel;
    this.faction = faction;
  }
}

module.exports = Planet;
