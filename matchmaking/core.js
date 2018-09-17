const _ = require('lodash');

const players = [];
const playersInfoStore = {};
const freePlayers = [];
const games = [];

const STATE_BADNAME = 1;
const STATE_SEARCHING = 2;
const STATE_PLAY = 3;
const STATE_PLAYERTURN = 4;
const STATE_BOARDUPDATE = 5;
const STATE_GAMEOVER = 6;
const STATE_PLAYERQUIT = 7;

const MAX_COLS = 7;
const MAX_ROWS = 6;

const MAX_PLAYER_TURN_MS = 10000;
const MAX_USERNAME_LENGTH = 32;

let gameIdAllocator = 0;

// TODO create a dispose function that clears the sheduler

class Matchmaking {
    constructor(io) {
        this.players = [];
        this.freePlayers = [];
        this.games = [];

        this.schedulerId = setInterval(() => this.scheduleNextTick(), 10);

        io.on('connection', socket => this.handleNewConnection(socket));
    }

    scheduleNextTick() {
        _.each(this.games, game => {
            game.scheduleNextTick();
        });
    }

    findPlayerBySocketID(id) {
        return _.find(this.players, player => player.socket.id === id);
    }

    markPlayerAsInGame(player) {
        const freePlayersIdx = _.findIndex(this.freePlayers, p => p.socket.id === player.socket.id);

        if (freePlayersIdx > 0) {
            this.freePlayers.splice(freePlayersIdx, 1);
        }
    }

    handleNewConnection(socket) {
        socket.on('join', ({ username }) => {
            if (this.findPlayerBySocketID(socket.id)) return;

            if (username.length >= MAX_USERNAME_LENGTH) {
                // TODO bad name
                return;
            }

            const player = new Player(socket, username);
            this.players.push(player);
            this.freePlayers.push(player);

            console.debug('New player', username);

            socket.emit('state', { id: STATE_SEARCHING, });

            while (this.freePlayers.length >= 2) {
                const p1 = this.freePlayers.shift();
                const p2 = this.freePlayers.shift();

                const game = new Game([
                    p1,
                    p2,
                ]);

                this.games.push(game);
            }
        });

        socket.on('disconnect', () => this.handleDisconnect(socket));
    }

    handleDisconnect(socket) {
        let idx;

        idx = _.findIndex(this.freePlayers, p => p.socket.id === socket.id);
        if (idx >= 0) {
            this.freePlayers.splice(idx, 1);
        }

        idx = _.findIndex(this.players, p => p.socket.id === socket.id);
        if (idx >= 0) {
            this.players.splice(idx, 1);
        }

        // TODO check

        // Disconnect him from game if in game
    }
}

class Player {
    constructor(socket, username) {
        this.socket = socket;
        this.username = username;
        this.game = null;
        this.color = '';

        socket.on('set', ({ column }) => this.handleSet(column));
        socket.on('continue', () => this.handleContinue());
    }

    handleSet(column) {
        this.game.handlePlayerSet(this, column);
    }

    handleContinue() {
        this.game.handleContinue();
    }

    attachToGame(game) {
        this.game = game;

        this.send('state', {
            id: STATE_PLAY,
            players: game.rawPlayersData(),
            initialBoard: game.board,
            currentTurn: 0,
        });
    }

    send(name, data) {
        this.socket.emit(name, data);
    }

    rawData() {
        const { username, color } = this;
        return { username, color };
    }
}

class Game {
    constructor(players) {
        this.players = players;
        this.turnStart = Date.now();

        players[0].color = 'red';
        players[1].color = 'yellow';

        this.resetGame();
    }

    handleContinue() {
        if (this.isGameover) {
            this.resetGame();
        }
    }

    resetGame() {
        this.board = [
            [ '', '', '', '', '', '', ],
            [ '', '', '', '', '', '', ],
            [ '', '', '', '', '', '', ],
            [ '', '', '', '', '', '', ],
            [ '', '', '', '', '', '', ],
            [ '', '', '', '', '', '', ],
            [ '', '', '', '', '', '', ],
        ];
        this.isGameover = false;

        this.currentTurn = 0;
        this.turnStart = Date.now();

        this.players.forEach(player => player.attachToGame(this));
    }

    broadcastGameOver(winner, coinsToHighlight) {
        this.isGameover = true;

        this.broadcast('state', {
            id: STATE_GAMEOVER,
            winner,
            coinsToHighlight,
        });
    }

    findColumnTop(column) {
        let i;

        for (i = this.board[column].length - 1; i >= 0; --i) {
            if (!this.board[column][i]) {
                break;
            }
        }

        return i;
    }

    getPlayerIDByColor(color) {
        return _.findIndex(this.players, p => p.color === color);
    }

    handlePlayerSet(player, column) {
        const idx = this.getPlayerIndex(player);
        let winData;

        if (this.currentTurn === idx && column < this.board.length && column >= 0) {
            const top = this.findColumnTop(column);

            if (top >= 0) {
                this.board[column][top] = player.color;
                this.broadcastBoardUpdate();
                this.nextPlayerTurn();

                // TODO handle draw
                if (winData = this.checkWin()) {
                    this.broadcastGameOver(this.getPlayerIDByColor(winData.cls), winData.coins);
                }
            }
        }
    }

    getPlayerIndex(player) {
        let i;

        for (i = 0; i < this.players.length; ++i) {
            if (this.players[i].socket.id === player.socket.id) {
                return i;
            }
        }

        return null;
    }

    scheduleNextTick() {
        if (this.isGameover) return;

        if (Date.now() - this.turnStart >= MAX_PLAYER_TURN_MS) {
            this.nextPlayerTurn();
        }
    }

    nextPlayerTurn() {
        this.currentTurn = (this.currentTurn + 1) % this.players.length;
        this.turnStart = Date.now();

        this.broadcast('state', {
            id: STATE_PLAYERTURN,
            currentTurn: this.currentTurn,
        });
    }

    broadcastBoardUpdate() {
        this.broadcast('state', {
            id: STATE_BOARDUPDATE,
            board: this.board,
        });
    }

    rawPlayersData() {
        return _.map(this.players, p => p.rawData());
    }

    broadcast(name, data) {
        let i;

        for (i = 0; i < this.players.length; ++i) {
            this.players[i].send(name, data);
        }
    }

    checkWin() {
        const { board } = this;
        let col, row, cls, coins;

        for (col = 0; col < MAX_COLS; ++col) {
            for (row = 0; row < MAX_ROWS; ++row) {
                if (cls = board[col][row]) {
                    if (coins = this.checkWinCls(cls, col, row)) {
                        return { cls, coins };
                    }
                }
            }
        }

        return false;
    }

    checkWinCls(cls, col, row) {
        let x, y, coins;

        for (x = -1; x <= 1; ++x) {
            for (y = -1; y <= 1; ++y) {
                if (x === 0 && y === 0) continue;

                if (coins = this.checkWinDir(cls, col, row, x, y)) {
                    return coins;
                }
            }
        }

        return false;
    }

    checkWinDir(cls, col, row, dirCol, dirRow) {
        const { board } = this;
        let coins = [];
        let i;

        for (i = 0; i < 4; ++i) {
            if (col < 0 || row < 0 || col >= MAX_COLS || row >= MAX_ROWS) {
                return false;
            }

            if (board[col][row] !== cls) {
                return false;
            }

            coins.push([ col, row ]);
            col += dirCol;
            row += dirRow;
        }

        return coins;
    }
}

// Handles a new connection
module.exports = (socket) => new Matchmaking(socket);
