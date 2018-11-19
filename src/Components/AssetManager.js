import React, { Component } from 'react';

class AssetManager extends Component {

  move(dest) {
    this.props.asset.loc = dest;
  }

  render() {
    return (
      <div>
        <div>{this.props.asset.name}</div>
        <div>{this.props.asset.faction.name}</div>
      </div>
    );
  }
}

export default AssetManager;
