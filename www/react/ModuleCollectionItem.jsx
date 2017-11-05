import React from 'react';


class ModuleCollectionItem extends React.Component {
	constructor(props) {
		super(props);

		this.getRandomInt = this.getRandomInt.bind(this);

	}

	render() {

		return (
			<li className={"collection-item avatar"} >
              <img src={"img/" + this.props.image} alt="" className="circle" />
              <span className="title">{this.props.title}</span>
              <p><i className="material-icons">favorite</i>{this.getRandomInt(72, 85)}</p>
              {/*<a href="#!" className="secondary-content"><i className="material-icons">grade</i></a>*/}
            </li>
		)
	}

	getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

}

export default ModuleCollectionItem;