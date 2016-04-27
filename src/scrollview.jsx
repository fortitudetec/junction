import React from 'react';
import { Actions, ButtonClickedAction } from './actions';

export default React.createClass({
  render ( ) {
    let style = { 
      height: this.props.height, 
      overflow: 'auto' 
    };
    
    return (
      <div style={style}>
        {this.props.children}
      </div>
    );
  }
});
