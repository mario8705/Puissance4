import React, { Component } from 'react';
import Board from './Board';
import PlayerList from './PlayerList';
import logo from './logo.png';

class Game extends Component {
    state = {
        board: [
            [ '', '', '', '', '', ''],
            [ '', '', '', '', '', ''],
            [ '', '', '', '', '', ''],
            [ '', '', '', '', '', ''],
            [ '', '', '', '', '', ''],
            [ '', '', '', '', '', ''],
            [ '', '', '', '', '', ''],
        ]
    }

    handleColumnClick = (col) => {
        this.setState(({ board }) => {
            var i;

            for (i = board[col].length - 1; i >= 0; --i) {
                if (!board[col][i]) {
                    break;
                }
            }

            board[col][i] = 'red';
            return { board }
        })
    }

    render() {
        const { board } = this.state;

        return (
          <div className="GAME">
            <h1 className="title2">Puissance 4</h1>
            <div className="game">
                <Board>
                    {
                        board.map((row, i) => (
                            <Board.Column key={i} onClick={() => this.handleColumnClick(i)} rows={row} />
                        ))
                    }
                </Board>
                  <img src={logo} className="LOGO" alt="logo" />
                  <img src={logo} className="LOGO2" alt="logo" />
                <PlayerList players={[
                    {
                        name: 'Alex',
                        color: 'red',
                    },
                    {
                        name: 'Test',
                        color: 'blue',
                    },
                ]} />
            </div>
          </div>
        );
    }
}

export default Game;
