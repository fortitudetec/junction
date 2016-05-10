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

const Queries = React.createClass({
  //*****************************************************************************
  //*****************************************************************************
  getInitialState ( ) {
    return {
      queries: this.props.queries || [],
      queryGroups: this.props.queries || []
    };
  },
  
  //*****************************************************************************
  //*****************************************************************************
  componentDidMount ( ) {
    this._queryStore = QueryStore;
    this._queryStore.addListener(Actions.NEW_QUERY, this._updateQueryGroups);
    this._queryStore.addListener(Actions.REMOVE_QUERY, this._updateQueryGroups);
    this._queryStore.addListener(Actions.NEW_QUERY_GROUP, this._updateQueryGroups);
    this._queryStore.addListener(Actions.REMOVE_QUERY_GROUP, this._updateQueryGroups);
    this._queryStore.addListener(Actions.NEW_GEO_QUERY_SHAPE, this._updateQueryGroups);

    // create a default query when the component loads
    this._newQueryGroup();
  },

  //*****************************************************************************
  //*****************************************************************************
  componentWillUnmount ( ) {
    // this._queryStore.removeAllListeners();
  },
  
  //*****************************************************************************
  //*****************************************************************************
  _updateQueryGroups ( queryGroups ) {
    let state = this.state;
    
    let groups = queryGroups.map((element) => {
      return <QueryGroup key={element.queryGroupId} id={element.queryGroupId} queries={element.queries} />;
    });
    
    state.queryGroups = groups;
    this.setState(state);
  },
  
  //*****************************************************************************
  //*****************************************************************************
  _newQueryGroup ( ) {
    DispatcherAction(Actions.NEW_QUERY_GROUP, null);
  },
  
  //*****************************************************************************
  //*****************************************************************************
  render ( ) {
    return (
      <div>
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
      </div>
    );
  }
});

export default Queries;