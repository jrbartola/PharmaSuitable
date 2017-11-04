import React from 'react';


class LexBox extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {

		return (
			<div className="row">
              <form className="col s12">
              <div className="row">
                <div className="input-field">
                  <i className="material-icons prefix">help_outline</i>
                  <textarea id="icon_prefix2" rows="5" className="materialize-textarea">sadfjlk</textarea>
                  <label htmlFor="icon_prefix2">{"Hi! I'm Lex. Ask me anything!"}</label>
                </div>
              </div>
            </form>
          </div>
		)
	}
}

export default LexBox;