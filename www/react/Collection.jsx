import React from 'react';

import ScheduleCollectionItem from './ScheduleCollectionItem.jsx';
import ModuleCollectionItem from './ModuleCollectionItem.jsx';

class Collection extends React.Component {
	constructor(props) {
		super(props);

	}

	render() {

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
                      <ScheduleCollectionItem key={i} title={t.pill} color={t.color} description={t.description} onClick={() => this.props.onTabChange(i)} />
                    )}
                    <li>
                     <div className="collapsible-header add-tab"><i className="material-icons">add</i>Add Schedule</div>
                    </li>
                  </div>
                }
                {!this.props.schedule &&
                  <div>
                    {this.props.tabs.map((t, i) =>
                      <ModuleCollectionItem key={i + "x"} image={t.image} description={t.description} title={t.title} />
                    )}
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