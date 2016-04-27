import React from 'react';
import ReactDOM from 'react-dom';

import {Actions, RemoveQueryAction} from '../actions';
import _ from './react-semantic';

export default React.createClass({
  
  propTypes: {
    label: React.PropTypes.string,
    options: React.PropTypes.array.isRequired,
    selected: React.PropTypes.func
  },
  
  componentDidMount ( ) {
    $(ReactDOM.findDOMNode(this)).dropdown();
  },
  
  _selectionChanged ( e ) {
    if ( this.props.selected ) {
      this.props.selected(e.target.value);
    }
  },
  
  render ( ) {
    
    let optionElements = [];
    let options = [{name: this.props.label}].concat(this.props.options);

    if ( options instanceof Array ) {
      for ( let idx in this.props.options ) {
        let option = this.props.options[idx];
        optionElements.push(<option value={idx} key={idx}>{option}</option>);
      }
    }
    else {
      console.assert(false, "Supplied options is not an array");
    }
    
    return (
      <select className="ui fluid dropdown" onChange={this._selectionChanged} >
        <option value="">{this.props.label}</option>
        {optionElements}
      </select>
    );
  }
});
