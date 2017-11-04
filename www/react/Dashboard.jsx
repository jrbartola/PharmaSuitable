import React from 'react';

import Collection from './Collection.jsx';
import InfoPane from './InfoPane.jsx';

class Dashboard extends React.Component {
	constructor(props) {
		super(props);

		this.onTabChange = this.onTabChange.bind(this);
		this.getPills = this.getPills.bind(this);

		// Poll DB eventually
//		this.state = {
//		  tabs: [
//		      {pill: "Tylenol", description: "Treats minor aches and pains, and reduces fever", color: "red", count: 2,
//		       fill: "November 1", dosage: "1000mg/day"},
//		      {pill: "Tramadol", description: "Treats moderate to severe pain", color: "orange", count: 7, fill: "October 14",
//		       dosage: "35mg 2x/day"},
//		      {pill: "Adderall", description: "Used to treat attention deficit hyperactivity disorder", color: "green", count: 24,
//		       fill: "October 29", dosage: "20mg/day"}
//		  ],
//		  selected: {pill: "Tylenol", description: "This is a decription for Tylenol", color: "red", count: 2, fill: "November 1",
//		    dosage: "1000mg/day"},
//		  modules: [
//		      {title: "Temperature", data: "98.6", image: "temp.png"},
//		      {title: "Heart Rate", data: "82", image: "heartrate.png"}
//		  ]
//		}

		this.state = {
		  tabs: [],
		  selected: {},
		  modules: [
		      {title: "Temperature", data: "98.6", image: "temp.png"},
		      {title: "Heart Rate", data: "82", image: "heartrate.png"}
		  ]
		}

		this.getPills();
	}

	render() {
		return (
			<div id="dashboard">
			  <div className="row">
			    <div className="col s3">
                  <Collection title="Schedule" tabs={this.state.tabs} onTabChange={this.onTabChange} selected={this.state.selected} schedule={true} />
                </div>
                <div className="col s6">
                  <InfoPane tabs={this.state.tabs} selected={this.state.selected} />
                </div>
                <div className="col s3">
                  <Collection title="Health" tabs={this.state.modules} schedule={false} />
                </div>
			  </div>
			</div>
		)
	}

	onTabChange(index) {
	    const tab = this.state.tabs[index];
	    this.setState({selected: tab});
	}

	getPills() {
        $.get("http://localhost:3000/api/pills", (data, _, err) => {
            console.log(data);
            if (err.status != 200) {
                console.err(err);
            } else {
                this.setState({tabs: data, selected: data[0]});
            }
        });
	}
}

export default Dashboard;