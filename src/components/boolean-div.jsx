import React from 'react';
import {Actions, RemoveQueryAction} from '../actions';
import ReactDOM from 'react-dom';
import semanticUI from './react-semantic';

export default React.createClass({
  
  getInitialState ( ) {
    return {
      show: false
    };
  },
  
  propTypes: {
    show: React.PropTypes.bool.isRequired,
  },
  
  componentWillReceiveProps ( newProps ) {   
    this.setState({
      show: newProps.show
    });
  },
  
  
  render ( ) {    
    let children = this.state.show ? this.props.children : null;
    
    return (
      <div>
        {children}
      </div>
    );
  }
});