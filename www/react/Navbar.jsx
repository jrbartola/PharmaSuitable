import React from 'react';

class Navbar extends React.Component {
	constructor(props) {
		super(props);

		//this.state.outer = props.outer;
	}

	render() {
		return (
			<nav>
              {this.props.outer &&
                <div className="nav-wrapper">
                  <img src="../img/medical_cross.png" className="cross-logo" />
                  <a href="#" className="brand-logo">PharmaSuitable</a>
                  <i className="material-icons right right-padding">person</i>
                  <a href="#" className="right">Sally Smith</a>
                </div>
              }
              {!this.props.outer &&
                <div className="nav-wrapper inner">
                  <img src="../img/pill_drawing.png" className="cross-logo" />
                  <a href="#" className="brand-logo">{this.props.selected.name}</a>
                  <span className="right right-padding">
                    <a className="waves-effect waves-light btn">Order</a>
                  </span>
                </div>
              }
            </nav>
		)
	}
}

export default Navbar;