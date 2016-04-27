import React from 'react';
import { Actions, ButtonClickedAction } from '../actions';
import semanticUI from './react-semantic';

export default React.createClass({
  getDefaultProps ( ) {
    return {
      type: "link", 
      size: null,
    };
  },
  render ( ) {
    const classString = "ui button " + this.props.type;
    return <button className={classString} onClick={this.props.clickCallback}>
      {this.props.children}
    </button>;
  }
});
