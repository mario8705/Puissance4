import React, { Component } from 'react';
import map from 'lodash/map';
import set from 'lodash/set';
import merge from 'lodash/merge';
import repeat from 'lodash/repeat';
import cx from 'classnames';

class SearchingPanel extends Component {
    state = {
        ticks: 0,
    }

    componentDidMount() {
        this.timer = setInterval(this.tick, 400);
    }

    componentWillUnmount() {
        clearInterval(this.timer);
    }

    render() {
        const { ticks } = this.state;

        return (
            <div className="panel-fs-wrapper">
                <div className="panel searching">
                    <h1>{'Searching for an opponent' + repeat('.', ticks)}</h1>
                </div>
            </div>
        );
    }

    tick = () => {
        this.setState(({ ticks }) => ({
            ticks: (ticks % 3) + 1,
        }));
    }
}

class Multiplayer extends Component {
    state = {
        username: null,
        invalidUsername: false,
    }

    handleSubmitUsername = (e) => {
        const formData = new FormData(e.target);
        e.preventDefault();

        const {username } = merge(...
            map(
                [...formData.entries()],
                ([ name, value ]) => set({}, name, value)
            )
        );

        if (username) {
            this.setState({ username, invalidUsername: false });
            // TODO something, send 'join' msg to server
        } else {
            this.setState({
                invalidUsername: true
            });
        }
    }

    render() {
        const { username, invalidUsername } = this.state;

        if (username === null) {
            return (
                <form onSubmit={this.handleSubmitUsername}>
                    <div className="panel-fs-wrapper">
                        <div className="panel choose-username">
                            <h1>Username</h1>
                            <span className={cx('error', { 'visible': invalidUsername })}>Your username needs to be a least 1 character long.</span>
                            <input type="text" name="username" placeholder="e.g. CATALcraft1" />
                            <div className="btn-group">
                                <button type="button" onClick={0}>Back</button>
                                <button type="button">Ok</button>
                            </div>
                        </div>
                    </div>
                </form>
            );
        }

        return (
            <SearchingPanel />
        );
    }
}

export default Multiplayer;
