import React, { Component } from 'react';

class Asset extends Component {
  constructor(props) {
    super(props);
    // this.name = name;
    // this.faction = faction;
    // this.id = id;
    // this.maxHp = hp;
    // this.currentHp = hp;
  }
  render() {
    return (
      <div>
        {this.name}
      </div>
    );
  }
}
