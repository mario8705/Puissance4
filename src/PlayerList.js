import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

class PlayerList extends Component {
    static propTypes = {
        players: PropTypes.arrayOf(
            PropTypes.shape({
                username: PropTypes.string,
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
                    players.map(({ username, color }, id) => (
                        <li key={id} className={cx({ 'active': (active === id) })}>
                            <span style={{ background: color }} />
                            <h2>{username}</h2>
                            <div className="timer" />
                        </li>
                    ))
                }
            </ul>
        );
    }
}

export default PlayerList;
