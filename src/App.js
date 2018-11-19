import React, { Component } from 'react';
import './App.css';
import Faction from './Models/Faction.js';
import Asset from './Models/Asset.js';
import AssetManager from './Components/AssetManager.js';
import loadSystem from './Loaders/jsonParser.js';

class App extends Component {
  constructor(props) {
    super(props);
    this.system = loadSystem(this.props.path);
  }
  render() {
    var testFaction = new Faction("dominion", "fff");
    var testAsset = new Asset("cyberninjas", testFaction, 1, 40, {star:null, orbital:null});
    return (
      <div className="b-app">
        <AssetManager asset={testAsset}/>

        <div>
          {this.system.name}
          <div>
            {/* {this.system.factions.map((val) => {return val.name;})} */}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
