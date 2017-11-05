import React from 'react';

import ScheduleCollectionItem from './ScheduleCollectionItem.jsx';
import ModuleCollectionItem from './ModuleCollectionItem.jsx';

class Collection extends React.Component {
	constructor(props) {
		super(props);

	}

	render() {

	    const heartrate = this.props.heartrate;
	    const temperature = this.props.temperature;

		return (
			<div id="accordion">
			  <div className="card inner">
                <div className="card-content white-text">
                  <span className="card-title center">{this.props.title}</span>
                </div>
              </div>
              <ul className="collection">
                {this.props.schedule &&
                  <div>
                    {this.props.tabs.map((t, i) =>
                      <ScheduleCollectionItem key={i} title={t.name} color={t.color} description={t.description} onClick={() => this.props.onTabChange(i)} />
                    )}
                    <li>
                     <div className="collapsible-header add-tab"><i className="material-icons">add</i>Add Schedule</div>
                    </li>
                  </div>
                }
                {!this.props.schedule &&
                  <div>
                    <ModuleCollectionItem image={heartrate.image} title={heartrate.title} data={heartrate.data} />
                    <ModuleCollectionItem image={temperature.image} title={temperature.title} data={temperature.data} />
                    <li>
                     <div className="collapsible-header add-tab"><i className="material-icons">add</i>Add Module</div>
                    </li>
                  </div>
                }

              </ul>
			</div>
		)
	}


}

export default Collection;