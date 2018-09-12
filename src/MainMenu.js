import React from 'react';
import { Link } from 'react-router-dom';
import logo from './logo.png';

const MainMenu = () => (
    <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1 className="App-title">Bienvenue sur Puissance 4</h1>
        <div className="TheButtons">
            <Link to="/game">1V1</Link>
            <Link to="/online">Multiplayer</Link>
        </div>
    </header>
);

export default MainMenu;
