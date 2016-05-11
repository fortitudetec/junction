import React from 'react';
import ReactDOM from 'react-dom';
import semanticUI from '../react-semantic';
import {Actions, DispatcherAction} from '../../actions';

export default React.createClass({
  
  SW_LAT: 'swLat',
  SW_LNG: 'swLng',
  NE_LAT: 'neLat',
  NE_LNG: 'neLng',
  
  //*****************************************************************************
  //*****************************************************************************
  propTypes: {
    id: React.PropTypes.string,
    queryGroupId: React.PropTypes.string,
    bounds: React.PropTypes.object,
    shapeId: React.PropTypes.string
  },
  
  //*****************************************************************************
  //*****************************************************************************
  componentDidMount ( ) {
  },
  
  //*****************************************************************************
  //*****************************************************************************
  _validateLatitude ( value ) {
    return /(^-?[0-9](\.\d+)*$)|(^-?[1-8][0-9](\.\d+)*$)|(^-?90(\.0+)*)$/.test(value);
  },
  
  //*****************************************************************************
  //*****************************************************************************
  didChange ( event ) {    
  },
  
  //*****************************************************************************
  //*****************************************************************************
  getInitialState ( ) {
    const bounds = this.boundsFromProps(this.props.bounds);
    return {
      id: this.props.id,
      queryGroupId: this.props.queryGroupId,
      shapeId: this.props.shapeId,
      swLat: bounds.swLat,
      swLng: bounds.swLng,
      neLat: bounds.neLat, 
      neLng: bounds.neLng,
      valid: this._validateBounds(bounds)
    }
  },
  
  //*****************************************************************************
  //*****************************************************************************
  componentWillReceiveProps ( newProps ) {
    let state = this.state;
    const bounds = this.boundsFromProps(newProps.bounds);
    state.swLat = bounds.swLat;
    state.swLng = bounds.swLng;
    state.neLat = bounds.neLat;
    state.neLng = bounds.neLng;
    state.valid = this._validateBounds(state);
    this.setState(state);
  },
  
  //*****************************************************************************
  //*****************************************************************************
  boundsFromProps ( boundsObject ) {
    if ( boundsObject ) {
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
    }
    
    return { swLat: '', swLng: '', neLat: '', neLng: '' };
  },
  
  //*****************************************************************************
  //*****************************************************************************
  _mouseEnter ( event ) {
    DispatcherAction(Actions.HIGHLIGHT_RECTANGLE, {
      shapeId: this.props.shapeId,
      highlight: true
    });
  },
  
  //*****************************************************************************
  //*****************************************************************************
  _mouseLeave ( event ) {
    DispatcherAction(Actions.HIGHLIGHT_RECTANGLE, {
      shapeId: this.props.shapeId,
      highlight: false
    });
  },
  
  //*****************************************************************************
  //*****************************************************************************
  _changed ( event ) {    
    const value = event.target.value;
    let state = this.state;
    
    switch ( event.target.name ) {
      case this.SW_LAT:
        state.swLat = value;
        break;
      case this.SW_LNG:
        state.swLng = value;
        break;
      case this.NE_LAT:
        state.neLat = value;
        break;
      case this.NE_LNG:
        state.neLng = value;
        break;
      default:
        break;
    }
    
    state.valid = this._validateBounds(state);
    this.setState(state);
    
    // dispatch an even notifying interested parties of the state 
    // change
    DispatcherAction(Actions.QUERY_CHANGED, {
      id: this.state.id,
      queryGroupId: this.state.queryGroupId,
      valid: this.state.valid,
      shapeId: this.state.shapeId,
      bounds: {
        sw: { lat: this.state.swLat, lng: this.state.swLng },
        ne: { lat: this.state.neLat, lng: this.state.neLng }
      }
    });
  },
  
  //*****************************************************************************
  //*****************************************************************************
  _validateBounds ( bounds ) { 
    return this._latitudeValid(bounds.swLat) && 
           this._longitudeValid(bounds.swLng) &&
           this._latitudeValid(bounds.neLat) && 
           this._longitudeValid(bounds.neLng);
  },
  
  //*****************************************************************************
  //*****************************************************************************
  _latitudeValid ( latitude ) { 
    let latitudeNumber = parseFloat(latitude);
    
    return (!isNaN(latitudeNumber)) && 
           (latitudeNumber >= -90.0) &&
           (latitudeNumber <= 90.0);
  },
  
  //*****************************************************************************
  //*****************************************************************************
  _longitudeValid ( longitude ) {
    let longitudeNumber = parseFloat(longitude);
    
    return (!isNaN(longitudeNumber)) && 
           (longitudeNumber >= -180.0) &&
           (longitudeNumber <= 180.0);
  },
  
  //*****************************************************************************
  //*****************************************************************************
  render ( ) { 
    
    return (
      <div className="ui form" onMouseEnter={this._mouseEnter} onMouseLeave={this._mouseLeave} >
        <div className="field">
          <label>{this.state.valid}</label>
          <label>Southwest Corner</label>
          <div className="two fields">
            <input type="text" placeholder="Latitude" name={this.SW_LAT} value={this.state.swLat}  onChange={this._changed} />
            <input type="text" placeholder="Longitude" name={this.SW_LNG} value={this.state.swLng}  onChange={this._changed} />
          </div>
        </div>
        
        <div className="field">
          <label>Northeast Corner</label>
          <div className="two fields">
            <input type="text" placeholder="Latitude" name={this.NE_LAT} value={this.state.neLat}  onChange={this._changed} />
            <input type="text" placeholder="Longitude" name={this.NE_LNG} value={this.state.neLng}  onChange={this._changed} />
          </div>
        </div>
        <div className="ui error message"></div>
      </div>
    );
  }
});