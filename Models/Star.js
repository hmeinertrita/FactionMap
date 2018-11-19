import Orbital from './Orbital.js';

class Star {
  constructor(name, planets) {
    this.name = name;
    this.orbitals = [];
    for (var i = 0; i < 11; i++){
      this.orbitals.push(new Orbital('Euthenia-'+i));
    }

    for (var p in planets) {
      this.orbitals[p.orbital].planets.push(p.planet);
    }
  }

  addAsset(asset, orbital) {
    this.orbitals[orbital].assets.push(asset);
  }

  removeAsset(asset, orbital) {
    delete this.orbitals[orbital].assets[asset.id];
  }

  findAsset(asset) {
    for (var i = 0; i < 11; i++){
      if (this.orbitals[i].assets[asset.id]) {
        return i;
      }
    }
    return -1;
  }
}

export default Star;
