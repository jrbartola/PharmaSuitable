import React from 'react';


class LexBox extends React.Component {
	constructor(props) {
		super(props);

		this.talkToLex = this.talkToLex.bind(this);
	}

	render() {

		return (
			<div className="row">
              <form className="col s12">
              <div className="row">
                <div className="input-field">
                  <i onClick={this.talkToLex} className="material-icons prefix pointer">help_outline</i>
                  <textarea id="icon_prefix2" rows="5" className="materialize-textarea"></textarea>
                  <label htmlFor="icon_prefix2">{"Hi! I'm Lex. Ask me anything!"}</label>
                </div>
              </div>
            </form>
            <div className="audio-control">
              <p id="audio-control" className="white-circle">
                {/*<img src="images/lex.png" />*/}
                <canvas className="visualizer"></canvas>
               </p>
             <p><span id="message"></span></p>
           </div>
          </div>
		)
	}

	talkToLex() {
        new lexaudio.example();
	}
}

export default LexBox;