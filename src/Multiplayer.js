import React, { Component, Fragment } from 'react';
import { Route } from 'react-router-dom';
import Board from './Board';
import PlayerList from './PlayerList';
import Gameover from './Gameover';
import map from 'lodash/map';
import set from 'lodash/set';
import find from 'lodash/find';
import merge from 'lodash/merge';
import cx from 'classnames';
import io from './socket';

const STATE_BADNAME = 1;
const STATE_SEARCHING = 2;
const STATE_PLAY = 3;
const STATE_PLAYERTURN = 4;
const STATE_BOARDUPDATE = 5;
const STATE_GAMEOVER = 6;

class SearchingPanel extends Component {
    render() {
        return (
            <div className="panel-fs-wrapper">
                <div className="panel searching">
                    <div className="lds-dual-ring" />
                    <h1>Searching for an opponent</h1>
                </div>
            </div>
        );
    }
}

class Multiplayer extends Component {
    state = {
        username: null,
        invalidUsername: false,
        serverState: 0,
        connectionLost: false,
        board: [],
        players: [],
        currentTurn: null,
        coinsToHighlight: [],
    }

    getPlayerOwnColor() {
        const self = this.findSelf();

        if (self) {
            return self.color;
        }

        return null;
    }

    findSelf() {
        return find(this.state.players, p => p.username === this.state.username);
    }

    componentDidMount() {
        io.on('state', this.handleStateChange);
        io.on('disconnect', () => alert('Connection lost'));
        // io.on('disconnect', () => this.setState({ connectionLost: true }));
        // io.on('connect', () => this.setState({ connectionLost: false }));
    }

    handleStateChange = ({ id, initialBoard, players, currentTurn, board, winner, coinsToHighlight, }) => {
        if (id === STATE_PLAY) {
            this.setState({
                board: initialBoard,
                players,
                currentTurn,
            });
        } else if (id === STATE_PLAYERTURN) {
            this.setState({ currentTurn });
            return; // Don't change the global state, just update the current player's turn
        }
        else if (id === STATE_BOARDUPDATE) {
            this.setState({ board });
            return; // Keep global state, only update the board
        } else if (id === STATE_GAMEOVER) {
            this.setState({
                winner,
                coinsToHighlight,
            });
        }

        this.setState({ serverState: id });
    }

    findColumnTop(column) {
        const { board } = this.state;
        let i;

        for (i = board[column].length - 1; i >= 0; --i) {
            if (!board[column][i]) {
                break;
            }
        }

        return i;
    }

    handleColumnClick = column => {
        if (!this.canPlay() || this.state.serverState !== STATE_PLAY) {
            return;
        }

        const top = this.findColumnTop(column);

        if (top >= 0) {
            this.setState(({ board: newBoard }) => {
                const board = [...newBoard];
                board[column][top] = this.getPlayerOwnColor();
                return { board };
            })

            io.emit('set', {
                column,
            });
        }
    }

    canPlay() {
        const { players, username, currentTurn } = this.state;

        return players.findIndex(p => p.username === username) === currentTurn;
    }

    handleSubmitUsername = (e) => {
        const formData = new FormData(e.target);
        e.preventDefault();

        const { username } = merge(
            ...map(
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

    newGame() {
        io.emit('continue');
    }

    render() {
        const { invalidUsername, serverState, connectionLost, board, players, currentTurn, winner } = this.state;

        if (serverState === 0 || serverState === STATE_BADNAME) {
            return (
                <form onSubmit={this.handleSubmitUsername}>
                    <div className="panel-fs-wrapper">
                        <div className="panel choose-username ">
                            <h1>Username</h1>
                            <span className={cx('error', { 'visible': invalidUsername })}>Your username needs to be a least 1 character long.</span>
                            <input type="text" name="username" placeholder="e.g. CATALcraft1" />
                            <footer className="panel-footer">
                                <div className="btn-group">
                                    <Route render={({ history }) => (
                                        <button type="button" onClick={() => history.push('/')}>Back</button>
                                    )} />
                                    <button type="submit">Ok</button>
                                </div>
                            </footer>
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

        if (serverState === STATE_PLAY || serverState === STATE_GAMEOVER) {
            const playElements = (
                <div className={cx('game', { 'is-darken': (serverState === STATE_GAMEOVER) })}>
                    <h1 className="title">Puissance 4</h1>
                    <div className="board-wrapper">
                    <Board>
                        {
                            board.map((column, id) => (
                                <Board.Column key={id} onClick={() => this.handleColumnClick(id)} rows={column} />
                            ))
                        }
                    </Board>
                    </div>
                    <PlayerList players={players} active={currentTurn} />
                </div>
            );

            if (serverState === STATE_GAMEOVER) {
                let text;

                if (winner === null) {
                    text = 'Égalité';
                } else {
                    const { username } = players[winner];
                    text = `Victoire du joueur ${username} !`;
                }

                return (
                    <Fragment>
                        {playElements}
                        <Gameover text={text} onClick={() => this.newGame()} />
                    </Fragment>
                )
            }

            return playElements;
        }

        return null;
    }
}

export default Multiplayer;
