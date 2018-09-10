import React, { Component, Fragment } from 'react';
import { Route, Switch } from 'react-router-dom';
import Game from './Game';
import logo from './logo.png';
import './App.css';

class App extends Component {
  componentWillMount() {
    this.audio = new Audio();
    this.audio.src = '/Free.mp3';
    this.audio.autoplay = true;
  }

  render() {
    return (
      <Fragment>
      <div className="SpeakerOn">
        <i
          onClick={() => {
            this.audio.paused ? this.audio.play() : this.audio.pause();
            this.forceUpdate();
          }}
          className={'fa ' + (this.audio.paused ? 'fa-volume-off' : 'fa-volume-up')} />
      </div>
        <Switch>
            <Route path="/" exact render={() => (
                <div className="App">
                    <header className="App-header">
                        <img src={logo} className="App-logo" alt="logo" />
                        <h1 className="App-title">Bienvenue sur Puissance 4</h1>
                        <div className="TheButtons">
                            <button className="ButtonSolo" type="button"><a href="/game">1V1</a></button>
                            <button className="ButtonMulti" type="button"><a href="/game">Multiplayer</a></button>
                        </div>
                        <div className="SpeakerOn">
                          <i
                            onClick={() => {
                              this.audio.paused ? this.audio.play() : this.audio.pause()
                              this.forceUpdate()
                            }}
                            className={'fa ' + (this.audio.paused ? 'fa-volume-off' : 'fa-volume-up')} />
                        </div>
                    </header>
                </div>
            )} />
            <Route path="/game" exact component={Game} />
      </Switch>
      </Fragment>
    );
  }
}

export default App;
