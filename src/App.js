import React, { Component, Fragment } from 'react';
import { Route, Switch } from 'react-router-dom';
import MainMenu from './MainMenu';
import Game from './Game';
import Multiplayer from './Multiplayer';
import VolumeControlSwitch from './VolumeControlSwitch';

class App extends Component {
    componentWillMount() {
        this.audio = new Audio();
        this.audio.src = '/Free.mp3';
        this.audio.autoplay = true;
        this.audio.loop = true;
    }

    render() {
        return (
            <Fragment>
                <VolumeControlSwitch isPlaying={this.audio.paused} onClick={() => {
                    if (this.audio.paused) {
                        this.audio.play();
                    } else {
                        this.audio.pause();
                    }

                    this.forceUpdate();
                }} />
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
