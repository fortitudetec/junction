import React from 'react';
import ReactDOM from 'react-dom';

export default React.createClass({
  
  getInitialState ( ) {
    return {
      children: [],
      clientChangeCallback: null
    }
  },
  
  componentDidMount ( ) {
    let state = this.state;
    let clonedChildren = [];
    
    React.Children.forEach(this.props.children, (child) => {
      let clonedChild = React.cloneElement(child, {
        key: child.key,
        onChange: this._changed
      });
      
      if ( child.props.onchange ) {
        state.clientChangeCallback = child.props.onchange;
      }
      
      clonedChildren.push(clonedChild);
    });
    
    state.children = clonedChildren;
    
    this.setState(state);
  },
  
  componentWillUnmount ( ) {
  },
  
  _changed ( event ) {
    if ( this.state.clientChangeCallback ) {
      this.state.clientChangeCallback(event);
    }
  },
  
  render ( ) {
    return (
      <div>
        {this.state.children}
      </div>
    );
  }
});
