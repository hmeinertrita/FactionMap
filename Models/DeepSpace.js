const Orbital = require('./Orbital.js');
const Region = require('./Region.js');

class DeepSpace extends Region.CompositeRegion {
  constructor(name, size, planets) {
    const orbitals = [];
    for (var i = 0; i < size; i++){
      orbitals.push(new Orbital(i, name+'-'+i, ...(planets[i] ? planets[i]:[])));
    }
    super(...orbitals);
    this.orbitals = orbitals;
    this.name = name;
  }

  addAsset(asset, orbital) {
    this.orbitals[orbital].assets.push(asset);
  }

  removeAsset(asset, orbital) {
    delete this.orbitals[orbital].assets[asset.id];
  }

  findAsset(asset) {
    for (var i = 0; i < this.orbitals.length; i++){
      if (this.orbitals[i].assets[asset.id]) {
        return i;
      }
    }
    return -1;
  }
}

module.exports = DeepSpace;
