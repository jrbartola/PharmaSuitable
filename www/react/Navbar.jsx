import React from 'react';
import swal from 'sweetalert';

class Navbar extends React.Component {
	constructor(props) {
		super(props);

		this.makeOrder = this.makeOrder.bind(this);
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
                    <a className="waves-effect waves-light btn modal-trigger" onClick={this.makeOrder}>Order</a>
                  </span>
                </div>
              }
            </nav>
		)
	}

	makeOrder() {
	    swal("Success!", "Your order has been placed at CVS Pharmacy on 76 N Pleasant St.", "success");
	    $.get("http://18.221.211.47:3000/api/reset/" + this.props.selected.name, (data) => console.log(data));
	}
}

export default Navbar;