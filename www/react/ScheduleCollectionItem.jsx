import React from 'react';


class ScheduleCollectionItem extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {

		return (
			<li className="collection-item avatar" onClick={this.props.onClick} >
              <img src={"img/" + this.props.color + "_circle.png"} alt="" className="circle" />
              <span className="title">{this.props.title}</span>
              <p>{this.props.description}</p>
              <h6>{this.props.count}</h6>
            </li>
		)
	}
}

export default ScheduleCollectionItem;