import React, { Component } from 'react';

class PlayerList extends Component {
    render() {
        const { players } = this.props;

        return (
            <ul className="players">
                {
                    players.map(({ name, color }, id) => (
                        <li>
                            <span style={{ background: color }} />
                            <h2>{name}</h2>
                            <div className="timer" />
                        </li>
                    ))
                }
            </ul>
        );
    }
}

export default PlayerList;
