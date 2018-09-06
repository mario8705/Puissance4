import Board from './Board';
import React, { Component } from 'react';

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
            <Board>
                {
                    board.map((row, i) => (
                        <Board.Column key={i} onClick={() => this.handleColumnClick(i)} rows={row} />
                    ))
                }
            </Board>
        );
    }
}

export default Game;
