import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';

jest.unmock('../query-store');
jest.unmock('../actions');
jest.unmock('../dispatcher');
jest.unmock('../queries');
jest.unmock('flux');
jest.unmock('fbemitter');
jest.unmock('../components/query-group');
import _uniq from 'lodash/uniq';
import Queries from '../queries.jsx';
import {Actions, DispatcherAction} from '../actions';
import QueryStore from '../query-store';

describe('app', () => {
  let queries;
  let _processedActions = [];
  const _processGeoQueryChange = (action, shape) => {
    _processedActions.push(action);
  };
  
  beforeEach(() => {
    QueryStore.reset();
    QueryStore.removeAllListeners();
    _processedActions = [];
    
    const addListener = (queryStore, action) => {
      queryStore.addListener(action, (shape) => {
        _processGeoQueryChange(action, shape);
      });
    };
        
    addListener(QueryStore, Actions.SHOW_RECTANGLE);
    addListener(QueryStore, Actions.REMOVE_RECTANGLE);
    
    queries = TestUtils.renderIntoDocument(<Queries />);
  });
  
  //*****************************************************************************
  //*****************************************************************************
  describe('Mounting', () => {
    it('should initially have no queries', () => {
      expect(queries.state.queries.length).toEqual(0);
    });
    
    it('should initially have a single query group', () => {
      expect(queries.state.queryGroups.length).toEqual(1);
    });
  });
  
  //*****************************************************************************
  //*****************************************************************************
  describe('Query groups', () => {
    
    //***************************************************************************
    //***************************************************************************
    it('creates and deletes query groups', () => {
      for ( let i = 0; i < 5; i++ ) {
        DispatcherAction(Actions.NEW_QUERY_GROUP, null);
      }
      
      // one is created automatically on mount
      expect(queries.state.queryGroups.length).toEqual(6);  
      
      let queryGroupIds = queries.state.queryGroups.map((qg) => {
        return qg.props.id;
      });    
      
      expect(_uniq(queryGroupIds).length).toEqual(6);
      
      for ( let idx in queryGroupIds ) {
        const offset = parseInt(idx) + 1;
        const qgId = queryGroupIds[idx];
        DispatcherAction(Actions.REMOVE_QUERY_GROUP, {queryGroupId: qgId});
        
        let currentQueryGroupIds = queries.state.queryGroups.map((qg) => {
          return qg.props.id;
        }); 
        
        expect(_uniq(currentQueryGroupIds).length).toEqual(queryGroupIds.length - offset);
        expect(currentQueryGroupIds.indexOf(qgId)).toEqual(-1);        
      }
    });
  }); // end query groups
  
  //*****************************************************************************
  //*****************************************************************************
  describe('Queries', () => {
    let _queryGroupIds;
    
    beforeEach(() => {
      DispatcherAction(Actions.NEW_QUERY_GROUP, null);
      expect(queries.state.queryGroups.length).toEqual(2);
      
      _queryGroupIds = queries.state.queryGroups.map((qg) => {
          return qg.props.id;
        }); 
    });
    
    it('creates and deletes a queries from a query group', () => {
      const newQuery1 = {
        queryGroupId: _queryGroupIds[0],
        type: 'text'
      };
      
      const newQuery2 = {
        queryGroupId: _queryGroupIds[1],
        type: 'text'
      };
      
      DispatcherAction(Actions.NEW_QUERY, newQuery1);
      DispatcherAction(Actions.NEW_QUERY, newQuery2);
      expect(queries.state.queryGroups[0].props.queries.length).toEqual(1);
      expect(queries.state.queryGroups[1].props.queries.length).toEqual(1);
      
      // make sure the queries have different ids
      expect(queries.state.queryGroups[0].props.queries[0].id).not.toEqual(queries.state.queryGroups[1].props.queries[0].id);
      
      DispatcherAction(Actions.REMOVE_QUERY, {
        queryGroupId: _queryGroupIds[1],
        id: queries.state.queryGroups[1].props.queries[0].id
      });
      
      expect(queries.state.queryGroups[0].props.queries.length).toEqual(1);
      expect(queries.state.queryGroups[1].props.queries.length).toEqual(0);
    });
    
    //***************************************************************************
    //***************************************************************************
    describe('Geo query processing', () => {
      
      beforeEach(() => {
        DispatcherAction(Actions.NEW_GEO_QUERY_SHAPE, {
          valid: true,
          bounds: {
            sw: { lat: 1.0, lng: 1.0 },
            ne: { lat: 2.0, lng: 2.0 }
          }
        });
        
        expect(queries.state.queryGroups[0].props.queries.length).toEqual(1);
        expect(queries.state.queryGroups[1].props.queries.length).toEqual(1);
      });
      
      it('creates a geo-query for each query group when drawn on map', () => {
        expect(_processedActions.length).toEqual(1);
      });
      
      it('keeps rectangle when a query is removed if reference still exists', () => {
        expect(_processedActions.length).toEqual(1);
        DispatcherAction(Actions.REMOVE_QUERY, {
          queryGroupId: _queryGroupIds[1],
          id: queries.state.queryGroups[1].props.queries[0].id
        });
      
        expect(_processedActions.length).toEqual(1);
        expect(queries.state.queryGroups[0].props.queries.length).toEqual(1);
        expect(queries.state.queryGroups[1].props.queries.length).toEqual(0);
      });
      
      it('removes rectangle when no more queries reference it', () => {
        expect(_processedActions.length).toEqual(1);
        
        queries.state.queryGroups.forEach((qg) => {
          DispatcherAction(Actions.REMOVE_QUERY, {
            queryGroupId: qg.props.id,
            id: qg.props.queries[0].id
          });
        }); // end forEach
        
        expect(_processedActions.length).toEqual(2);
        expect(queries.state.queryGroups[0].props.queries.length).toEqual(0);
        expect(queries.state.queryGroups[1].props.queries.length).toEqual(0);
       });
      
    }); // end geo query processing
  }); // end queries
  
  
});