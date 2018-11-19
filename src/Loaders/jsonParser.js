import Faction from '../Models/Faction.js';
import Asset from '../Models/Asset.js';
import Orbital from '../Models/Orbital.js';
import Planet from '../Models/Planet.js';
import Star from '../Models/Star.js';
import System from '../Models/System.js';

const fs = require('fs');

async function loadSystem(path) {
  const dataString = await fs.readFile(path);
  const data = JSON.parse(dataString);

  const factions = [];
  for (var f in data.system.factions) {
    factions.push(new Faction(f.name, f.colour));
  }

  const stars = [];
  for (var s in data.system.stars) {
    const planets = [];
    for (var p in s.planets) {
      const planet = new Planet(p.name, p.techLevel);
      planets.push({planet: planet, orbital: p.orbital});
    }
    stars.push(new Star(s.name, planets));
  }

  const system = new System(data.system.name, factions, stars);

  return system;
}

export default loadSystem;
