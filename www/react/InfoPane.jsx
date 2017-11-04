import React from 'react';

import Navbar from './Navbar.jsx';

class InfoPane extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div id="infopane">
              <Navbar outer={false} selected={this.props.selected} />
			</div>
		)
	}

}

export default InfoPane;