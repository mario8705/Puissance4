import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Board from './Board';
import PlayerList from './PlayerList';

const MAX_COLS = 7;
const MAX_ROWS = 6;

class Game extends Component {
    static propTypes = {
        players: PropTypes.arrayOf(
            PropTypes.shape({
                name: PropTypes.string,
                color: PropTypes.string,
            })
        ).isRequired,
        onWin: PropTypes.func.isRequired,
    }

    static defaultProps = {
        players: [
            {
                name: 'Jack',
                color: 'red',
            },
            {
                name: 'Daniels',
                color: 'yellow',
            },
        ],
        onWin: p => setTimeout(() => alert(p + ' has won'), 30)
    }

    state = {
        board: [
            [ '', '', '', '', '', ''],
            [ '', '', '', '', '', ''],
            [ '', '', '', '', '', ''],
            [ '', '', '', '', '', ''],
            [ '', '', '', '', '', ''],
            [ '', '', '', '', '', ''],
            [ '', '', '', '', '', ''],
        ],
        active: 0,
    }

    componentWillMount() {
        this.setPlayerTurn(0);
    }

    setPlayerTurn(id) {
        clearTimeout(this.turnTimeout);
        this.setState({ active: id });
        this.turnTimeout = setTimeout(() => {
            this.setPlayerTurn((id + 1) % 2);
        }, 10000);
    }

    handleColumnClick = (col) => {
        let i;
        const { players } = this.props;
        // TODO clone board ?
        const { board, active } = this.state;
        const cls = players[active].color;

        for (i = board[col].length - 1; i >= 0; --i) {
            if (!board[col][i]) {
                break;
            }
        }

        if (i < 0) {
            return;
        }

        board[col][i] = cls;

        this.setState({ board });

        this.checkWin();

        this.setPlayerTurn((active + 1) % 2);
    }

    render() {
        const { players } = this.props;
        const { board, active } = this.state;

        return (
            <div className="game">
                <Board>
                    {
                        board.map((row, i) => (
                            <Board.Column key={i} onClick={() => this.handleColumnClick(i)} rows={row} />
                        ))
                    }
                </Board>
                <PlayerList players={players} active={active} />
            </div>
        );
    }

    checkWin() {
        const { board } = this.state;
        let col, row, cls;

        for (col = 0; col < MAX_COLS; ++col) {
            for (row = 0; row < MAX_ROWS; ++row) {
                if (cls = board[col][row]) {
                    if (this.checkWinCls(cls, col, row)) {
                        this.props.onWin(cls);
                        return;
                    }
                }
            }
        }
    }

    checkWinCls(cls, col, row) {
        let x, y;

        for (x = -1; x <= 1; ++x) {
            for (y = -1; y <= 1; ++y) {
                if (x === 0 && y === 0) continue;

                if (this.checkWinDir(cls, col, row, x, y)) {
                    return true;
                }
            }
        }

        return false;
    }

    checkWinDir(cls, col, row, dirCol, dirRow) {
        const { board } = this.state;
        let i;

        for (i = 0; i < 4; ++i) {
            if (col < 0 || row < 0 || col >= MAX_COLS || row >= MAX_ROWS) {
                return false;
            }

            if (board[col][row] !== cls) {
                return false;
            }

            col += dirCol;
            row += dirRow;
        }

        return true;
    }
}

export default Game;
