import React from 'react';
import {Actions, RemoveQueryAction} from '../actions';

export default React.createClass({
  
  propTypes: {
    id: React.PropTypes.string.isRequired,
    removeCallback: React.PropTypes.func.isRequired,
    hideCloseButton: React.PropTypes.bool
  },
  
  _removeQuery ( ) {
    this.props.removeCallback(this.props.id);
  },
  
  render ( ) {
    
    let closeButton = null;
    if ( !this.props.hideCloseButton ) {
      closeButton = ( 
        <div>
          <a href="#" onClick={this._removeQuery}>
            <i className="close icon"></i>
          </a> <br />
        </div>); 
    }
    
    return (
      <div className="pleasant-padding">
        {closeButton}
        {this.props.children}
      </div>
    );
  }
});
