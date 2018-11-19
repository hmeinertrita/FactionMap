const Faction = require('../Models/Faction.js');
const Asset = require('../Models/Asset.js');
const Orbital = require('../Models/Orbital.js');
const Planet = require('../Models/Planet.js');
const Star = require('../Models/Star.js');
const System = require('../Models/System.js');

const fs = require('fs');
const readFile = (path) => {
  return new Promise(function (resolve, reject) {
    fs.readFile(path, function (error, result) {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};

async function loadSystem(path) {
  const dataString = await readFile(path);
  console.log('Loading: ' + path);
  const data = JSON.parse(dataString);

  const factions = [];
  data.system.factions.forEach((f) => {
    factions.push(new Faction(f.name, f.colour));
    console.log('Created faction ' + f.name);
  });

  const stars = [];
  data.system.stars.forEach((s) => {
    const planets = [];
    s.planets.forEach((p) => {
      const planet = new Planet(p.name, p.techLevel);
      planets.push({planet: planet, orbital: p.orbital});
      console.log('Created planet '+ planet.name);
    });
    stars.push(new Star(s.name, planets));
    console.log('Created star '+ s.name);
  });

  const system = new System(data.system.name, stars, factions);

  return system;
}

module.exports = loadSystem;
