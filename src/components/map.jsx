import React from 'react';
import ReactDOM from 'react-dom';
import Mapbox from 'mapbox.js';
import {Actions, DispatcherAction} from '../actions';
import QueryStore from "../query-store";

require('leaflet-draw');
require('!style!css!leaflet-draw/dist/leaflet.draw.css');

export default React.createClass({
  
  //*****************************************************************************
  //*****************************************************************************
  propTypes: {
    /*
    Rectangle should be object that looks like:
    {
      id: id,
      sw: {lat: 'swlat', lng: 'swlng'}
      ne: {lat: 'nelat', lng: 'nelng'}
    }
    */
    rectangles: React.PropTypes.array
  },
  
  //*****************************************************************************
  //*****************************************************************************
  getInitialState ( ) {
    return {
      rectangles: this.props.rectangles ? this.props.rectangles.map(this._createRectangleLayer) : []
    };
  },
  
  //*****************************************************************************
  //*****************************************************************************
  _createRectangleLayer ( rectangle ) {
    const bounds = [[rectangle.sw.lat, rectangle.sw.lng], [rectangle.ne.lat, rectangle.ne.lng]];
    return { id: rectangle.id, layer: L.rectangle(bounds) };
  },
  
  //*****************************************************************************
  //*****************************************************************************
  componentWillReceiveProps ( newProps ) {
    let state = this.state;

    if ( newProps.rectangles ) {
      state.rectangles = newProps.rectangles.map(this._createRectangleLayer);
    }
    
    this.setState(state);
  },
  
  //*****************************************************************************
  //*****************************************************************************
  _addRectangleToMap ( rectangle ) {
    let state = this.state;
    state.rectangles.push(this._createRectangleLayer(rectangle));
    this.setState(state);
  },
  
  _removeRectangleFromMap ( rect ) {
    let state = this.state;
        
    state.rectangles = state.rectangles.filter((rectangle) => {
      return rectangle.id !== rect.id;
    });
    
    this.setState(state);
  },
  
  //*****************************************************************************
  //*****************************************************************************
  componentDidMount ( ) {
    
    this._queryStore = QueryStore;
    this._queryStore.addListener(Actions.SHOW_RECTANGLE, this._addRectangleToMap);
    this._queryStore.addListener(Actions.REMOVE_RECTANGLE, this._removeRectangleFromMap);
    
    L.mapbox.accessToken = 'pk.eyJ1IjoicHNjaG1lcmdlIiwiYSI6ImNpbWNtZ2ZjeTAwMTh0aWx2bG02bzgycXEifQ.MjkqAnyv1sXIxlOeTAkZKQ';
    var map = L.mapbox.map(ReactDOM.findDOMNode(this), 'mapbox.streets', { zoomControl: false }).setView([40, -74.50], 9);
    new L.Control.Zoom({ position: 'topright' }).addTo(map);
    
    
    var drawnItems = new L.FeatureGroup();
    map.addLayer(drawnItems);

    // Initialise the draw control and pass it the FeatureGroup of editable layers
    var drawControl = new L.Control.Draw({
      edit: {
        featureGroup: drawnItems
      },
      draw: {
        polyline: false,
        polygon: false,
        rectangle: true,
        circle: false,
        marker: false
      }
    });
    
    map.addControl(drawControl);
    
    map.on('draw:created', (e) => {
      const layer = e.layer;

      const bounds = {
        sw: {
          lat: layer.getBounds()._southWest.lat,
          lng: layer.getBounds()._southWest.lng
        },
        ne: {
          lat: layer.getBounds()._northEast.lat,
          lng: layer.getBounds()._northEast.lng
        }
      }

      DispatcherAction(Actions.NEW_GEO_QUERY_SHAPE, { bounds: bounds });
    });
    
    this.map = map;
    this.drawnShapeFeatureGroup = drawnItems;
    this.map.invalidateSize();
  },
  
  //*****************************************************************************
  //*****************************************************************************
  componentDidUpdate ( ) {
    this.map.invalidateSize();
  },
  
  //*****************************************************************************
  //*****************************************************************************
  render ( ) {
    let divStyle = {  
      width: "100%", 
      height: this.props.height 
    };
    
    if ( this.drawnShapeFeatureGroup ) {
      this.drawnShapeFeatureGroup.clearLayers();
    }
    
    this.state.rectangles.forEach((rectangle) => {
      this.drawnShapeFeatureGroup.addLayer(rectangle.layer);
    });
    
    return <div className='map' style={divStyle}></div>;
  }
  
});