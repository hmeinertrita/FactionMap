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
const openFile = (path) => {
  return new Promise(function (resolve, reject) {
    fs.open(path, 'w', function (error, fd) {
      if (error) {
        reject(error);
      } else {
        resolve(fd);
      }
    });
  });
};

async function writeSystem(system) {
  data = {name: system.name}

  data.stars = [];
  for (var s in system.stars) {
    const planets = [];
    system.stars[s].orbitals.forEach((o, i) => {
      o.planets.forEach((p) => {
        planets.push({name: p.name, techLevel: p.techLevel, orbital: i});
      });
    });
    data.stars.push({name: system.stars[s].name, planets: planets});
  }

  data.factions = [];
  system.factions.forEach((f) => {
    data.factions.push({name: f.name, colour: f.colour});
  });

  openFile('./Data/saveTest.json').then(fd => {
    writeFile(fd, JSON.stringify({system: data}));
  });
}

module.exports = writeSystem;
