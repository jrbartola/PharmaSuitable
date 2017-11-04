import React from 'react';


class ModuleCollectionItem extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {

	    //const extraClass = this.props.selected.title == this.props.title ? " selected" : ""

		return (
			<li className={"collection-item avatar"} >
              <img src={"img/" + this.props.image} alt="" className="circle" />
              <span className="title">{this.props.title}</span>
              <p>{this.props.data}</p>
              {/*<a href="#!" className="secondary-content"><i className="material-icons">grade</i></a>*/}
            </li>
		)
	}
}

export default ModuleCollectionItem;