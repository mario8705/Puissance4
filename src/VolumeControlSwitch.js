import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

class VolumeControlSwitch extends Component {
    static propTypes = {
        playing: PropTypes.bool.isRequired,
        onClick: PropTypes.func.isRequired,
    }

    render() {
        const { isPlaying, onClick } = this.props;

        return (
            <div className="volume-control">
                <i
                    onClick={onClick}
                    className={cx('fa', {
                        'fa-volume-off': !isPlaying,
                        'fa-volume-up': isPlaying,
                    })} />
            </div>
        );
    }
}

export default VolumeControlSwitch;
