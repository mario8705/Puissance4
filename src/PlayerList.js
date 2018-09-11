import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

class PlayerList extends Component {
    static propTypes = {
        players: PropTypes.arrayOf(
            PropTypes.shape({
                name: PropTypes.string,
                color: PropTypes.string,
            })
        ).isRequired,
        // active
    }

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
