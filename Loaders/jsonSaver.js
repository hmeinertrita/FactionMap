const Faction = require('../Models/Faction.js');
const Asset = require('../Models/Asset.js');
const Orbital = require('../Models/Orbital.js');
const Planet = require('../Models/Planet.js');
const Star = require('../Models/Star.js');
const System = require('../Models/System.js');

const fs = require('fs');
const writeFile = (file, data) => {
  return new Promise(function (resolve, reject) {
    fs.write(file, data, function (error) {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
};

async function writeSystem(system) {
  data = {name: system.name}
  data.factions = [];
  system.factions.forEach((f) => {
    data.factions.push({name: f.name, colour: f.colour});
  });

  data.stars = [];
  system.stars.forEach((s) => {
    const planets = [];
    s.orbitals.forEach((o) => {
      o.planets.forEach((p) => {
        planets.push({name: p.name, techLevel: p.techLevel, orbital: p.orbital});
      });
    });
    data.stars.push({name: s.name, planets: planets});
  });
  writeFile('Data/saveTest.json', JSON.stringify({system: data}));
}

module.exports = writeSystem;
