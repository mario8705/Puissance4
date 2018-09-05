import Board from './Board';
import React, { Component } from 'react';

class Game extends Component {
    state = {
        board: [
            [ '', '', '', '', '', '', ''],
            [ '', '', '', '', '', '', ''],
            [ '', '', '', '', '', '', ''],
            [ '', '', '', '', '', '', ''],
            [ '', '', '', '', '', '', ''],
            [ '', '', '', '', '', '', ''],
        ]
    }

    handleColumnClick = (col) => {
        console.log(col);
    }

    render() {
        return (
            <Board>
                <Board.Column onClick={() => this.handleColumnClick(0)} rows={[]}} />
            </Board>
        );
    }
}

export default Game;
