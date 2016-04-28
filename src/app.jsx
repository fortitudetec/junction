import React from 'react';
import ReactDOM from 'react-dom';
import Button from "./components/button.jsx";
import QueryStore from "./query-store";
import {Actions, CreateQueryAction, DispatcherAction} from './actions';
import QueryForm from './components/query-builder/query-form.jsx';
import Map from "./components/map.jsx";
import { GutterLinks } from "./app-constants";
import { Router, Route, IndexRoute, Link, useRouterHistory } from 'react-router';
import { createHashHistory } from 'history';
import ScrollView from './scrollview';
import QueryGroup from './components/query-group';
import _uniqueId from 'lodash/uniqueId';

require('semantic-ui/dist/semantic.min.js');
require('!style!css!semantic-ui/dist/semantic.min.css');

import Form from './components/form';
import TextInput from './components/text-input';

const appHistory = useRouterHistory(createHashHistory)({ queryKey: false });
const App = React.createClass({
      
    getInitialState ( ) {
      return {
        queries: [],
        rectangles: [],
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
      
      this._queryStore = new QueryStore();
      this._queryStore.addListener(Actions.NEW_QUERY, this._updateQueryGroups);
      this._queryStore.addListener(Actions.REMOVE_QUERY, this._updateQueryGroups);
      this._queryStore.addListener(Actions.NEW_QUERY_GROUP, this._updateQueryGroups);
      this._queryStore.addListener(Actions.REMOVE_QUERY_GROUP, this._updateQueryGroups);
      this._queryStore.addListener(Actions.NEW_GEO_QUERY_SHAPE, this._updateQueryGroups);
      this._queryStore.addListener(Actions.SHOW_RECTANGLE, this._addRectangleToMap);
      // create a default query when the component loads
      this._newQueryGroup();
    },
    
    componentWillUnmount ( ) {
      this._queryStore.removeAllListeners();
      window.removeEventListener('resize', this._handleResize);
    },
    
    _updateQueryGroups ( queryGroups ) {
      let state = this.state;
      let groups = queryGroups.map((element) => {
        return <QueryGroup key={element.queryGroupId} id={element.queryGroupId} queries={element.queries} />;
      });
     
      state.queryGroups = groups;
      this.setState(state);
    },
    
    _newQuery ( ) {
    },
    
    _newQueryGroup ( ) {
      DispatcherAction(Actions.NEW_QUERY_GROUP, null);
    },
    
    _addRectangleToMap ( rectangle ) {
      let state = this.state;
      state.rectangles.push(rectangle);
      this.setState(state);
    },
    
    _validateText ( object, event ) {
      console.log("validating");
      return {valid: (event.target.value.length > 3), message: "canned response"};
    },
  
    render  ( ) {
        
      return (
        <div className="ui grid">
          <div className="four wide column no-right-padding">
            <ScrollView height={this.state.windowHeight}>
              <div className="pleasant-padding">
              
                {(() => {
                  if ( !this.state.queryGroups || this.state.queryGroups.length == 0 ) {
                    return (
                      <div>
                        <strong>New Query</strong>
                        <Button type="circular icon positive mini right floated right" clickCallback={this._newQueryGroup}>
                          <i className="icon plus"></i>
                        </Button>
                      </div>
                    );
                  }
                })()}
              
                {this.state.queryGroups}


{
                      // <Button type="circular icon red mini" clickCallback={this._newQueryGroup}>
                      //   <i className="icon remove"></i>
                      // </Button>
                      // <Button type="circular icon mini">
                      //   <i className="icon plus"></i>
                      // </Button>
  
// <br /><br /><br /><br /><br />
              
//                 <div className="ui grid">
//                   <div className="sixteen wide column">
//                     <Button type="circular icon mini">
//                       <i className="icon plus"></i>
//                     </Button>
//                   </div>
                
//                   <div className="fourteen wide column">
//                     {this.state.queryGroups}
//                   </div>
                  
//                   <div className="left floated left aligned sixteen two column">
//                     <Button type="circular icon red mini" clickCallback={this._newQueryGroup}>
//                       <i className="icon remove"></i>
//                     </Button>
//                   </div>
                
//                   <div className="three wide column">
//                       <Button type="negative mini">Cancel</Button>
//                   </div>
//                   <div className="eight wide column">
//                   </div>
//                   <div className="four wide column">
//                     <Button type="positive mini left floated">Search</Button>
//                   </div>
                  
//                 </div>
}
              
              
                {
                // <Form>
                //   <TextInput name="doot" validation={this._validateText} />
                // </Form> 
                // <br /><br />
                }

                
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
