import React from 'react';

import Dashboard from './Dashboard.jsx';

class Container extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div id="container">
			    <Dashboard />
			</div>
		)
	}
}

export default Container;