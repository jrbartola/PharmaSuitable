import React from 'react';


class ModuleCollectionItem extends React.Component {
	constructor(props) {
		super(props);

//		this.getRandomInt = this.getRandomInt.bind(this);

	}

	render() {

		return (
			<li className={"collection-item avatar"} >
              <img src={"img/" + this.props.image} alt="" className="circle" />
              <span className="title">{this.props.title}</span>
              <p><i className="material-icons">{this.props.icon}</i>{this.props.data}</p>
            </li>
		)
	}

//	getRandomInt(min, max) {
//        return Math.floor(Math.random() * (max - min + 1)) + min;
//    }

}

export default ModuleCollectionItem;