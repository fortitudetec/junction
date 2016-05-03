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

require('semantic-ui/dist/semantic.min.js');
require('!style!css!semantic-ui/dist/semantic.min.css');

import Form from './components/form';
import TextInput from './components/text-input';

const appHistory = useRouterHistory(createHashHistory)({ queryKey: false });
const App = React.createClass({
      
    getInitialState ( ) {
      return {
        windowHeight: window.innerHeight
      };
    },
    
    _handleResize ( e ) {
      let state = this.state;
      state.windowHeight = window.innerHeight;
      this.setState(state);
    },
    
    componentDidMount ( ) {
      // watch for window height changes
      window.addEventListener('resize', this._handleResize);
    },
    
    componentWillUnmount ( ) {
      window.removeEventListener('resize', this._handleResize);
    },
    
    _validateText ( object, event ) {
      return {valid: (event.target.value.length > 3), message: "canned response"};
    },
  
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
            <Map height={this.state.windowHeight} rectangles={this.state.rectangles} />
          </div>
        
        </div>
      );
    }
});

ReactDOM.render((<App />), document.getElementById('app'));

export default App;