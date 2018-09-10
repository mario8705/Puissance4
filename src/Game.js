import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Board from './Board';
import Gameover from './Gameover';
import PlayerList from './PlayerList';
import logo from './logo.png';

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
    }

    newGame() {
        this.setState(({ board: oldBoard }) => {
            const board = oldBoard.map(r =>
                r.map(() => ''));

            return {
                board,
                active: 0,
                gameover: false,
            };
        });
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
        gameover: false,
        winner: ''
    }

    setGameover(winner) {
        this.setState({
            gameover: true,
            winner,
        });
        clearTimeout(this.turnTimeout);
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
        const { players } = this.props;
        // TODO clone board ?
        const { board, active, gameover } = this.state;
        const cls = players[active].color;
        let i;

        if (gameover) {
            return;
        }

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
        const { board, active, gameover, winner } = this.state;

        return (
          <div className="GAME">
          {
              gameover && (
                  <Gameover text={`Victoire du joueur ${winner} !`} onClick={() => this.newGame()} />
              )
          }
          <div className="resume">
            <table>
                <thead>
                    <tr>
                        <td></td>
                        <td>Name</td>
                        <td>Victoires</td>
                        <td>Défaites</td>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Jack</td>
                        <td>1</td>
                    </tr>
                </tbody>
            </table>
          </div>
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
                  <PlayerList players={players} active={gameover ? null : active} />
            </div>
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
                        this.setGameover(cls);
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
