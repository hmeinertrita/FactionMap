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

async function loadSystem(path) {
  const dataString = await readFile(path);
  console.log('Loading: ' + path);
  const data = JSON.parse(dataString);

  const factions = {};
  data.system.factions.forEach((f) => {
    factions[f.colour] = new Faction(f.name, f.colour);
    console.log('Created faction ' + f.name);
  });

  const stars = [];
  data.system.stars.forEach((s) => {
    const planets = {};
    s.planets.forEach((p) => {
      const planet = new Planet(p.name, p.techLevel, factions[p.factionColour]);
      if (planets[p.orbital]) {
        planets[p.orbital].push(planet);
      }
      else {
        planets[p.orbital] = [planet];
      }
      console.log('Created planet '+ planet.name);
    });
    stars.push(new Star(s.name, planets));
    console.log('Created star '+ s.name);
  });

  const assets = {};
  data.system.assets.forEach((a, i) => {
    assets[i] = new Asset(i, a.name, a.callsign, a.locationName, factions[a.factionColour], a.maxHp, a.currentHp);
    console.log('Created asset ' + a.name);
  });

  const system = new System(data.system.name, stars, factions, assets);

  return system;
}


async function writeSystem(system) {
  data = {name: system.name}

  data.stars = [];
  system.stars.forEach(s => {
    const planets = [];
    s.orbitals.forEach((o, i) => {
      o.locations.forEach((p) => {
        planets.push({name: p.name, techLevel: p.techLevel, orbital: i});
      });
    });
    data.stars.push({name: s.name, planets: planets});
  });

  data.factions = [];
  for (var f in system.factions) {
    data.factions.push({name: f.name, colour: f.colour});
  }

  data.assets = [];
  for (var a in system.assets) {
    if (system.assets[a]) {
      data.assets.push({
        name: system.assets[a].name,
        callsign: system.assets[a].callsign,
        locationName: system.assets[a].locationName,
        factionColour: system.assets[a].faction.colour,
        maxHp: system.assets[a].maxHp,
        currentHp: system.assets[a].currentHp
      });
    }
  }

  openFile('./Data/saveTest.json').then(fd => {
    writeFile(fd, JSON.stringify({system: data}));
  });
  console.log('saved system to json');
}

module.exports = {
  read: loadSystem,
  write: writeSystem
};
