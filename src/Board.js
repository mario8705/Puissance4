import React, { Component } from 'react';

class Board extends Component {
    render() {
        const { children } = this.props;

        return (
            <div className="board">
                {children}
            </div>
        );
    }
}

Board.Column = class Column extends Component {
    render() {
        const { rows, ...props } = this.props;

        return (
            <div className="column" {...props}>
                {
                    rows.map((row, id) => (
                        <span key={id} className={row} />
                    ))
                }
            </div>
        );
    }
}

export default Board;
