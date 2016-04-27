import React from 'react';
import ReactDOM from 'react-dom';

export default React.createClass({
  
  propTypes: {
  },
  
  componentDidMount ( ) {
    let dom = $(ReactDOM.findDOMNode(this));
    dom.find('#rangestart').calendar({
      type: 'date',
      endCalendar: dom.find('#rangeend')
    });
    
    dom.find('#rangeend').calendar({
      type: 'date',
      startCalendar: dom.find('#rangestart')
    });
  },
  
  render ( ) {
    
    require('../../../dist/vendor/calendar.min.js');
    require('!style!css!../../../dist/vendor/calendar.min.css');
    
    return (
      <div className="ui form">
        <div className="field">
          <label>Start date</label>
          <div className="ui calendar" id="rangestart">
            <div className="ui input left icon">
              <i className="calendar icon"></i>
              <input type="text" placeholder="Start" />
            </div>
          </div>
        </div>
        <div className="field">
          <label>End date</label>
          <div className="ui calendar" id="rangeend">
            <div className="ui input left icon">
              <i className="calendar icon"></i>
              <input type="text" placeholder="End"/>
            </div>
          </div>
        </div>
      </div>
    );
  }
});
