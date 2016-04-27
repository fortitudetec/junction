import React from 'react';
import ReactDOM from 'react-dom';
import semanticUI from '../react-semantic';

export default React.createClass({
  
  propTypes: {
    onChange: React.PropTypes.func,
    bounds: React.PropTypes.object
  },
  
  componentDidMount ( ) {
  },
  
  _validateLatitude ( value ) {
    return /(^-?[0-9](\.\d+)*$)|(^-?[1-8][0-9](\.\d+)*$)|(^-?90(\.0+)*)$/.test(value);
  },
  
  didChange ( event ) {    
  },
  
  render ( ) {
    return (
      <div className="ui form">
        <div className="field">
          <label>Southwest Corner</label>
          <div className="two fields">
            <input type="text" placeholder="Latitude" name="swlat" onChange={this.didChange} />
            <input type="text" placeholder="Longitude" name="swlng" />
          </div>
        </div>
        
        <div className="field">
          <label>Northeast Corner</label>
          <div className="two fields">
            <input type="text" placeholder="Latitude" />
            <input type="text" placeholder="Longitude" />
          </div>
        </div>
        <div className="ui error message"></div>
      </div>
    );
  }
});