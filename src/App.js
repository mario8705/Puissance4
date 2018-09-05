import React, { Component } from 'react';
import logo from './logo.png';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Bienvenue sur Puissance 4</h1>
        <div className="TheButttons">
          <button className="ButtonSolo" type="button"><a href="https://lululataupe.com/tout-age/686-puissance-4">1V1</a></button>
          <button className="ButtonMulti" type="button"><a href="https://lululataupe.com/tout-age/686-puissance-4">Multiplayer</a></button>
        </div>
        </header>
      </div>
    );
  }
}

export default App;
