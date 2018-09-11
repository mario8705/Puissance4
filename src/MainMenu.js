import React from 'react';
import { Link } from 'react-router-dom';
import logo from './logo.png';

const MainMenu = () => (
    <div className="App">
        <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <h1 className="App-title">Bienvenue sur Puissance 4</h1>
            <div className="TheButtons">
                <button className="ButtonSolo" type="button"><Link to="/game">1V1</Link></button>
                <button className="ButtonMulti" type="button"><Link to="/online">Multiplayer</Link></button>
            </div>
        </header>
    </div>
);

export default MainMenu;
