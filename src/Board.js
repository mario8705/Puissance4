import React, { Component } from 'react';

class Board extends Component {
  constructor(props) {
        super(props);
        this.state = {'active': false, 'class': 'album'};
    }

  handleClick(id) {
    if(this.state.active){
      this.setState({'active': false,'class': 'album'})
    }else{
      this.setState({'active': true,'class': 'active'})
    }
  }
    render() {

        const { children } = this.props;

        return (
          <div className="wrapper">
            <ul className="coinContainer">
              {
                (new Array(6)).fill(null).map((_, y) => {
                  return (new Array(7)).fill(null).map((_, x) => {
                    return (
                      <li className="coin" style={{left:(x*59) + 'px', top:(y*59) + 'px'}} onClick=""></li>                  )
                  })
                })
              }
            </ul>
            <svg width="415" height="355" viewBox="0 0 415 355" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <mask id="mask">
                    <rect fill="white" width="60" height="60"/>
                    <circle cx="30" cy="30" r="25" stroke="black" stroke-width="2" fill="black" />
                </mask>
                <rect id="case" style={{ mask: "url(#mask)" }} x="0" y="0" width="60" height="60" fill="blue"/>
              </defs>
                {
                  (new Array(6)).fill(null).map((_, y) => {
                    return (new Array(7)).fill(null).map((_, x) => {
                      return (
                        <use href="#case" x={x*59} y={y*59}/>
                      )
                    })
                  })
                }
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
