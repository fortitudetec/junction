import React from 'react';
import ReactDOM from 'react-dom';
import Mapbox from 'mapbox.js';

require('leaflet-draw');
require('!style!css!leaflet-draw/dist/leaflet.draw.css');

export default React.createClass({
  
  componentDidMount ( ) {
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
      console.log("done drawed");
    });
    
    this.map = map;
    this.map.invalidateSize();
  },
  
  componentDidUpdate ( ) {
    this.map.invalidateSize();
  },
  
  render ( ) {
    let divStyle = {  
      width: "100%", 
      height: this.props.height 
    };
    
    return <div className='map' style={divStyle}></div>;
  }
});