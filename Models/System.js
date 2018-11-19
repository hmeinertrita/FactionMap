class System {
  constructor(name, stars, factions) {
    this.name = name;
    this.factions = factions;
    this.stars = {};
    stars.forEach((s) => {
      this.stars[s.name] = s;
    });
    this.assets = [];
  }
}

module.exports = System;
