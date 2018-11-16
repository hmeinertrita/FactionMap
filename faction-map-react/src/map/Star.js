import React, { Component } from 'react';

class Star extends Component {
  constructor(props) {
    super(props);
    //this.name = name;
    this.orbitals = [];
    for (var i = 0; i < 11; i++){
      this.orbitals.push(new Orbital('Euthenia-'+i));
    }
  }

  addPlanet(planet, orbital) {
    this.orbitals[orbital].planets.push[planet];
  }
}
