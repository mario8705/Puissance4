import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Gameover extends Component {
    static propTypes = {
        text: PropTypes.string.isRequired,
        onClick: PropTypes.func.isRequired,
    }

    render() {
        const { text, onClick } = this.props;

        return (
            <div className="gameover">
                <h2>{text}</h2>
                <button onClick={onClick}>Continue</button>
            </div>
        );
    }
}

export default Gameover;
