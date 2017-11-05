import React from 'react';

import Navbar from './Navbar.jsx';
import LexBox from './LexBox.jsx';

class InfoPane extends React.Component {
	constructor(props) {
		super(props);

		this.rotateArray = this.rotateArray.bind(this);

		this.state = {
		    days: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
		    months: ["January", "February", "March", "April", "May", "June", "July", "August", "September",
		             "October", "November", "December"]
		}
	}

	render() {

	    const remainingFraction = (this.props.selected.remaining / 5.0) * 100;
	    const remainingColor = remainingFraction <= 40.0 ? "red" : (remainingFraction <= 60.0 ? "orange" : "");


	    const remainingStyle = {width: remainingFraction + "%",
	                            backgroundColor: remainingColor + " !important"};
        console.log("YESYESYES", this.props.selected);

        const tsinre = this.props.selected.time_since_refill ? this.props.selected.time_since_refill : 0;

	    const sinceRefillPercent = ( tsinre / 30.0 ) * 100.0;

	    const today = new Date().getDay();
	    const streaks = this.rotateArray(today);

		return (
			<div id="infopane">
              <Navbar outer={false} selected={this.props.selected} />
              <div className="info-body">

                  <div className="card panel blue-grey darken-1">
                    <div className="card-content white-text">
                      <span className="card-title">Remaining
                      <i className="material-icons right right-padding">bubble_chart</i>
                      </span>
                      <p>{this.props.selected.remaining} out of 5</p>
                    </div>
                    <div className="card-action">
                      <div className="progress">
                        <div className="determinate" style={remainingStyle}></div>
                      </div>
                    </div>
                  </div>

                  <div className="card panel blue-grey darken-1">
                    <div className="card-content white-text">
                      <span className="card-title">Last Fill
                      <i className="material-icons right right-padding">access_time</i>
                      </span>
                      <p>{this.state.months[this.props.selected.last_refill.month] + " " + this.props.selected.last_refill.day}</p>
                    </div>
                    <div className="card-action">
                      <div className="progress">
                        <div className="determinate" style={{width: sinceRefillPercent + "%"}}></div>
                      </div>
                    </div>
                  </div>

                  <div className="card panel-large blue-grey darken-1">
                    <div className="card-content white-text streak">
                      <span className="card-title half">Streak</span>
                        <span className="half right streak">
                          {streaks.map((s, i) =>
                              <p className="day-streak center" key={i + "str"} style={{backgroundColor: this.props.selected.streak[i] == 1.0 ? "green" : "red"}}>{s}</p>
                          )}
                        </span>
                      <p>{this.props.selected.fill}</p>
                    </div>
                    <div className="card-action">
                      <div className="progress">
                        <div className="determinate" style={{width: this.props.selected.streak.reduce((t, e) => t+e) / 7.0 * 100 + "%"}}></div>
                      </div>
                    </div>
                  </div>


              </div>
              <LexBox />
			</div>
		)
	}

	rotateArray(n) {
	    const k = n % 7;
	    let arr = new Array(7);

	    for (let i = 0; i < 7; i++) {
	      arr[i] = this.state.days[(k + i) % 7];
	    }

	    return arr;

	}

}

export default InfoPane;