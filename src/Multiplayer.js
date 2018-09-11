import React, { Component } from 'react';
import Board from './Board';
import PlayerList from './PlayerList';
import map from 'lodash/map';
import set from 'lodash/set';
import merge from 'lodash/merge';
import repeat from 'lodash/repeat';
import cx from 'classnames';
import io from './socket';

const STATE_BADNAME = 1;
const STATE_SEARCHING = 2;
const STATE_PLAY = 3;

class SearchingPanel extends Component {
    state = {
        ticks: 0,
    }

    componentDidMount() {
        this.timer = setInterval(this.tick, 400);
    }

    componentWillUnmount() {
        clearInterval(this.timer);
    }

    render() {
        const { ticks } = this.state;

        return (
            <div className="panel-fs-wrapper">
                <div className="panel searching">
                    <h1>{'Searching for an opponent' + repeat('.', ticks)}</h1>
                </div>
            </div>
        );
    }

    tick = () => {
        this.setState(({ ticks }) => ({
            ticks: (ticks % 3) + 1,
        }));
    }
}

class Multiplayer extends Component {
    state = {
        username: null,
        invalidUsername: false,
        serverState: 0,
        connectionLost: false,
        board: [],
    }

    componentDidMount() {
        io.on('state', this.handleStateChange);
        io.on('disconnect', () => alert('Connection lost'));
        // io.on('disconnect', () => this.setState({ connectionLost: true }));
        // io.on('connect', () => this.setState({ connectionLost: false }));
    }

    handleStateChange = ({ id, initialBoard }) => {
        this.setState({ serverState: id });

        if (id === STATE_PLAY) {
            this.setState({
                board: initialBoard,
            });
        }
    }

    handleSubmitUsername = (e) => {
        const formData = new FormData(e.target);
        e.preventDefault();

        const {username } = merge(...
            map(
                [...formData.entries()],
                ([ name, value ]) => set({}, name, value)
            )
        );

        if (username) {
            this.setState({ username, invalidUsername: false });
            io.emit('join', { username });
        } else {
            this.setState({
                invalidUsername: true
            });
        }
    }

    render() {
        const { username, invalidUsername, serverState, connectionLost, board } = this.state;

        if (serverState === 0 || serverState === STATE_BADNAME) {
            return (
                <form onSubmit={this.handleSubmitUsername}>
                    <div className="panel-fs-wrapper">
                        <div className="panel choose-username">
                            <h1>Username</h1>
                            <span className={cx('error', { 'visible': invalidUsername })}>Your username needs to be a least 1 character long.</span>
                            <input type="text" name="username" placeholder="e.g. CATALcraft1" />
                            <div className="btn-group">
                                <button type="button">Back</button>
                                <button type="submit">Ok</button>
                            </div>
                        </div>
                    </div>
                </form>
            );
        }

        if (serverState === STATE_SEARCHING) {
            return (
                <SearchingPanel />
            );
        }

        if (connectionLost) {
            return (
                <div className="reconnecting">
                    <h1>Reconnecting...</h1>
                </div>
            )
        }

        if (serverState === STATE_PLAY) {
            return (
                <Board>
                    {
                        board.map((column, id) => (
                            <Board.Column key={id} rows={column} />
                        ))
                    }
                </Board>
            )
        }

        return null;
    }
}

export default Multiplayer;
