import React from 'react';
import Button from '../button';
import {Actions, DispatcherAction} from '../../actions';

export default React.createClass({
  
  propTypes: {
    id: React.PropTypes.string.isRequired,
    queryGroupId: React.PropTypes.string.isRequired
  },
  
  getInitialState ( ) {
    return {
      value: '',
    };
  },
  
  _onChange ( event ) {
    DispatcherAction(Actions.QUERY_CHANGED, {
      id: this.props.id,
      queryGroupId: this.props.queryGroupId, 
      oldValue: this.state.value,
      newValue: event.target.value
    });
    
    let state = this.state;
    state.value = event.target.value;
    this.setState(state);
  },
    
  render ( ) {
    return (
      <div className="pleasant-padding">
        <div className="ui grid">
          <div className="ui form sixteen wide column ">
            <div className="field">
              <textarea className="" placeholder="Query" onChange={this._onChange} value={this.state.value} ></textarea>
            </div>
          </div>
        </div>
      </div>
    );
  }
});
