class System {
  constructor(name, stars, factions) {
    this.name = name;
    this.factions = factions;
    this.stars = {};
    for (var s in stars) {
      this.stars[s.name] = s;
    }
    this.assets = [];
  }
}

export default System;
