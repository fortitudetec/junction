import React from 'react';
import ReactDOM from 'react-dom';
import Button from "./components/button.jsx";
import {Actions, CreateQueryAction, DispatcherAction} from './actions';
import QueryForm from './components/query-builder/query-form.jsx';
import Map from "./components/map.jsx";
import { GutterLinks } from "./app-constants";
import { Router, Route, IndexRoute, Link, useRouterHistory } from 'react-router';
import { createHashHistory } from 'history';
import ScrollView from './scrollview';
import QueryGroup from './components/query-group';
import _uniqueId from 'lodash/uniqueId';
import Queries from './queries';
import QueryStore from "./query-store";

require('semantic-ui/dist/semantic.min.js');
require('!style!css!semantic-ui/dist/semantic.min.css');

import Form from './components/form';
import TextInput from './components/text-input';

const appHistory = useRouterHistory(createHashHistory)({ queryKey: false });
const App = React.createClass({
      
  //*****************************************************************************
  //*****************************************************************************
  getInitialState ( ) {
    return {
      windowHeight: window.innerHeight,
      rectangles: [],
      highlighted: []
    };
  },
  
  //*****************************************************************************
  //*****************************************************************************
  _handleResize ( e ) {
    let state = this.state;
    state.windowHeight = window.innerHeight;
    this.setState(state);
  },
  
  //*****************************************************************************
  //*****************************************************************************
  componentDidMount ( ) {
    // watch for window height changes
    window.addEventListener('resize', this._handleResize);
    
    // watch for events to show on the map
    this._queryStore = QueryStore;
    this._queryStore.addListener(Actions.SHOW_RECTANGLE, this._addRectangleToMap);
    this._queryStore.addListener(Actions.REMOVE_RECTANGLE, this._removeRectangleFromMap);
    this._queryStore.addListener(Actions.HIGHLIGHT_RECTANGLE, this._highlightShape);
    
  },
  
  //*****************************************************************************
  //*****************************************************************************
  componentWillUnmount ( ) {
    window.removeEventListener('resize', this._handleResize);
  },
  
  //*****************************************************************************
  //*****************************************************************************
  _validateText ( object, event ) {
    return {valid: (event.target.value.length > 3), message: "canned response"};
  },
  
  //*****************************************************************************
  //*****************************************************************************
  _addRectangleToMap ( rectangle ) {
    let state = this.state;
    
    const existingRectangle = state.rectangles.find((element) => {
      return element.id === rectangle.id;
    });
    
    if ( existingRectangle !== undefined ) {
      existingRectangle.sw = rectangle.sw;
      existingRectangle.ne = rectangle.ne;
    }
    else {
      state.rectangles.push(rectangle);
    }
    
    this.setState(state);
  },
  
  //*****************************************************************************
  //*****************************************************************************
  _removeRectangleFromMap ( rect ) {
    let state = this.state;
        
    state.rectangles = state.rectangles.filter((rectangle) => {
      return rectangle.id !== rect.id;
    });
    
    this.setState(state);
  },
  
  //*****************************************************************************
  //*****************************************************************************
  _highlightShape ( layerInfo /* { id: ..., layer: ...} */ ) {
    let state = this.state;
    
    // add highlighting
    if ( layerInfo.highlight ) {
      state.highlighted.push(layerInfo.shapeId);
    }
    
    // remove highlighting
    else {
      state.highlighted = state.highlighted.filter((rect) => {
        return rect !== layerInfo.shapeId;
      });
    }
    
    this.setState(state);
  },

  //*****************************************************************************
  //***************************************************************************** 
  render  ( ) {
    return (
      <div className="ui grid">
        <div className="four wide column no-right-padding">
          <ScrollView height={this.state.windowHeight}>
            <div className="pleasant-padding">
              <Queries />
            </div>
          </ScrollView>
        </div>
        
        <div className="twelve wide column no-left-padding">
          <Map height={this.state.windowHeight} 
               rectangles={this.state.rectangles}
               highlighted={this.state.highlighted} />
        </div>
      
      </div>
    );
  }
});

ReactDOM.render((<App />), document.getElementById('app'));

export default App;