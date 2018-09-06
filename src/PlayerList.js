import React, { Component } from 'react';
import cx from 'classnames';

class PlayerList extends Component {
    render() {
        const { players, active } = this.props;

        return (
            <ul className="players">
                {
                    players.map(({ name, color }, id) => (
                        <li className={cx({ 'active': (active === id) })}>
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
