import React from 'react';
import swal from 'sweetalert';

import Collection from './Collection.jsx';
import InfoPane from './InfoPane.jsx';

class Dashboard extends React.Component {
	constructor(props) {
		super(props);

		this.onTabChange = this.onTabChange.bind(this);
		this.getPills = this.getPills.bind(this);
		this.getTemperature = this.getTemperature.bind(this);

		this.state = {
		  tabs: [],
		  selected: {streak: [0,0,0,0,0,0,0], name: "null", last_refill: {month: -1, day: -1, year: -1}},
		  heartrate: {title: "Heart Rate", data: "--", image: "heartrate.png", icon: "favorite"},
		  temperature: {title: "Temperature", data: "--", image: "temp.png", icon: "cloud_queue"}
		}

		this.getPills();
	}

	render() {
		return (
			<div id="dashboard">
			  <div className="row">
			    <div className="col m3">
                  <Collection title="Schedule" tabs={this.state.tabs} onTabChange={this.onTabChange} selected={this.state.selected} schedule={true} />
                </div>
                <div className="col m6">
                  <InfoPane tabs={this.state.tabs} selected={this.state.selected} />
                </div>
                <div className="col m3">
                  <Collection title="Health" heartrate={this.state.heartrate} temperature={this.state.temperature} schedule={false} />
                </div>
			  </div>
			</div>
		)
	}

	onTabChange(index) {
	    const tab = this.state.tabs[index];
	    if (tab.remaining == 0) {
	        swal({
	            title: "Urgent!",
	            text: "You required a new prescription for " + tab.name + ". Would you like to place an order?",
	            buttons: {
                    cancel: true,
                    confirm: "Yes",
                    roll: {
                        text: "Do a barrell roll!",
                        value: "roll",
                    },
                },
	        })
	    }
	    this.setState({selected: tab});
	}

	getPills() {
        $.get("http://18.221.211.47:3000/api/pills", (data, _, err) => {
            console.log(data);
            if (err.status != 200) {
                console.err(err);
            } else {
                this.setState({tabs: JSON.parse(data)['data']});
                if (this.state.selected.name == "null") {
                    this.setState({selected: JSON.parse(data)['data'][0]});
                } else {
                    this.setState({selected: this.state.tabs.find(t => t.name == this.state.selected.name)});
                }
            }
        });
	}

	getTemperature() {
	    $.get("http://18.221.211.47:3000/api/temperature", (data, _, err) => {
            console.log(data);
            if (err.status != 200) {
                console.err(err);
            } else {
                this.setState({temperature: {title: "Temperature", data: JSON.parse(data)['data']['value'], image: "temp.png", icon: "cloud_queue"});
            }
        });
	}

	componentDidMount() {
        setInterval(() => {
          this.getPills();
          this.getTemperature();
        }, 1000)}
	}
}

export default Dashboard;