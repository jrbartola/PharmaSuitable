import React from 'react';

import Collection from './Collection.jsx';
import InfoPane from './InfoPane.jsx';

class Dashboard extends React.Component {
	constructor(props) {
		super(props);

		this.onTabChange = this.onTabChange.bind(this);
		this.getPills = this.getPills.bind(this);

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
                this.setState({tabs: JSON.parse(data), selected: data[0]});
                this.forceUpdate();
            }
        });
	}
}

export default Dashboard;