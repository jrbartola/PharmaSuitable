import React from 'react';


class ModuleCollectionItem extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {

		return (
			<li className={"collection-item avatar"} >
              <img src={"img/" + this.props.image} alt="" className="circle" />
              <span className="title">{this.props.title}</span>
              <p><i className="material-icons">favorite</i>{this.props.data}</p>
              {/*<a href="#!" className="secondary-content"><i className="material-icons">grade</i></a>*/}
            </li>
		)
	}
}

export default ModuleCollectionItem;