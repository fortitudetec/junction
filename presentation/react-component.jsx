import React from 'react';

export default React.createClass({
  getInitialState() { return {}; },
  getDefaultProps() { return { greeting: 'Hello World!' }; },
  componentDidMount() { },
  componentWillUnmount() { },
  componentDidUpdate () { },
  componentWillReceiveProps() { },
  render ( ) { return <h1 onMouseEnter={() => { console.log(this.props.greeting)}}>{this.props.greeting}</h1>; }
});