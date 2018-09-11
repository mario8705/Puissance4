import React, { Component, Fragment, Provider } from 'react';
import { Route, Switch } from 'react-router-dom';
import MainMenu from './MainMenu';
import Game from './Game';
import Multiplayer from './Multiplayer';
import logo from './logo.png';
import './App.css';

class App extends Component {
    componentWillMount() {
        this.audio = new Audio();
        this.audio.src = '/Free.mp3';
        this.audio.autoplay = true;
        this.audio.loop = true;
    }

    render() {
        const val = {
            playing: this.audio.playing,
            setPlaying: playing => {
                if (playing) {
                    this.audio.pause();
                } else {
                    this.audio.play();
                }
            }
        }

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
                    <Route path="/" exact component={MainMenu} />
                    <Route path="/game" exact component={Game} />
                    <Route path="/online" exact component={Multiplayer} />
                </Switch>
            </Fragment>
        );
    }
}

export default App;
