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
  
  getInitialState ( ) {
    const bounds = this.boundsFromProps(this.props.bounds);
    return {
      swLat: bounds.swLat,
      swLng: bounds.swLng,
      neLat: bounds.neLat, 
      neLng: bounds.neLng
    }
  },
  
  componentWillReceiveProps ( newProps ) {
    let state = this.state;
    state.bounds = this.boundsFromProps(newProps.bounds);
    this.setState(state);
  },
  
  boundsFromProps ( boundsObject ) {
    let swLat = '';
    let swLng = '';
    let neLat = '';
    let neLng = '';
    let {sw, ne} = boundsObject;
    
    if ( sw ) {
      swLat = sw.lat ? sw.lat : '';
      swLng = sw.lng ? sw.lng : '';
    }
    
    if ( ne ) {
      neLat = ne.lat ? ne.lat : '';
      neLng = ne.lng ? ne.lng : '';
    }
    
    return { swLat: swLat, swLng: swLng, neLat: neLat, neLng: neLng };
  },
  
  render ( ) { 
    return (
      <div className="ui form">
        <div className="field">
          <label>Southwest Corner</label>
          <div className="two fields">
            <input type="text" placeholder="Latitude" name="swlat" defaultValue={this.state.swLat} />
            <input type="text" placeholder="Longitude" name="swlng" defaultValue={this.state.swLng} />
          </div>
        </div>
        
        <div className="field">
          <label>Northeast Corner</label>
          <div className="two fields">
            <input type="text" placeholder="Latitude"  defaultValue={this.state.neLat} />
            <input type="text" placeholder="Longitude" defaultValue={this.state.neLng} />
          </div>
        </div>
        <div className="ui error message"></div>
      </div>
    );
  }
});