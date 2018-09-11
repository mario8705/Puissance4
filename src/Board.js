import React, { Component } from 'react';

class Board extends Component {
    render() {
        const { children } = this.props;

        return (
          <div className="board">
            <svg width="500" height="500" viewBox="0 0 510 500" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 10"/>
              <rect width="550" height="550" style={{ fill: 'rgb(0,0,255)', 'strokeWidth': 3, 'stroke': 'rgb(0,0,0)'}} />
                <circle cx="50" cy="60" r="27" fill="white"/>
                <circle cx="120" cy="60" r="27" fill="white"/>
                <circle cx="190" cy="60" r="27" fill="white"/>
                <circle cx="260" cy="60" r="27" fill="white"/>
                <circle cx="330" cy="60" r="27" fill="white"/>
                <circle cx="400" cy="60" r="27" fill="white"/>
                <circle cx="470" cy="60" r="27" fill="white"/>

                <circle cx="50" cy="140" r="27" fill="white"/>
                <circle cx="120" cy="140" r="27" fill="white"/>
                <circle cx="190" cy="140" r="27" fill="white"/>
                <circle cx="260" cy="140" r="27" fill="white"/>
                <circle cx="330" cy="140" r="27" fill="white"/>
                <circle cx="400" cy="140" r="27" fill="white"/>
                <circle cx="470" cy="140" r="27" fill="white"/>

                <circle cx="50" cy="220" r="27" fill="white"/>
                <circle cx="120" cy="220" r="27" fill="white"/>
                <circle cx="190" cy="220" r="27" fill="white"/>
                <circle cx="260" cy="220" r="27" fill="white"/>
                <circle cx="330" cy="220" r="27" fill="white"/>
                <circle cx="400" cy="220" r="27" fill="white"/>
                <circle cx="470" cy="220" r="27" fill="white"/>

                <circle cx="50" cy="300" r="27" fill="white"/>
                <circle cx="120" cy="300" r="27" fill="white"/>
                <circle cx="190" cy="300" r="27" fill="white"/>
                <circle cx="260" cy="300" r="27" fill="white"/>
                <circle cx="330" cy="300" r="27" fill="white"/>
                <circle cx="400" cy="300" r="27" fill="white"/>
                <circle cx="470" cy="300" r="27" fill="white"/>

                <circle cx="50" cy="370" r="27" fill="white"/>
                <circle cx="120" cy="370" r="27" fill="white"/>
                <circle cx="190" cy="370" r="27" fill="white"/>
                <circle cx="260" cy="370" r="27" fill="white"/>
                <circle cx="330" cy="370" r="27" fill="white"/>
                <circle cx="400" cy="370" r="27" fill="white"/>
                <circle cx="470" cy="370" r="27" fill="white"/>

                <circle cx="50" cy="440" r="27" fill="white"/>
                <circle cx="120" cy="440" r="27" fill="white"/>
                <circle cx="190" cy="440" r="27" fill="white"/>
                <circle cx="260" cy="440" r="27" fill="white"/>
                <circle cx="330" cy="440" r="27" fill="white"/>
                <circle cx="400" cy="440" r="27" fill="white"/>
                <circle cx="470" cy="440" r="27" fill="white"/>
            </svg>
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
