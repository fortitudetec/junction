import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import _uniqueId from 'lodash/uniqueId';

jest.unmock('../query-store');
jest.unmock('lodash/uniqueId');
jest.unmock('../dispatcher');
jest.unmock("../actions");
jest.unmock('flux');

import QueryStore from '../query-store';
import Dispatcher from '../dispatcher';
import {Actions, DispatcherAction} from '../actions';

describe('QueryStore', () => {
  
  let queryStore;
  
  beforeEach(() => {
    queryStore = QueryStore;
    QueryStore.reset();
    QueryStore.removeAllListeners();
  });
  
  describe('query groups', ( ) => {
    it('initially has no query groups', () => {
      expect(queryStore.queryGroups().length).toEqual(0);
    });
    
    it('creates a new group', () => {
      DispatcherAction(Actions.NEW_QUERY_GROUP, null);
      expect(queryStore.queryGroups().length).toEqual(1);
    });
    
    it('removes a given query group', () => {
      DispatcherAction(Actions.NEW_QUERY_GROUP, null);
      expect(queryStore.queryGroups().length).toEqual(1);
      
      const queryGroupId = queryStore.queryGroups()[0].queryGroupId;
      DispatcherAction(Actions.REMOVE_QUERY_GROUP, {queryGroupId: queryGroupId});
      expect(queryStore.queryGroups().length).toEqual(0);
    });
    
    it('creates a query for a given query group', () => {
      expect(queryStore.queryGroups().length).toEqual(0);
      DispatcherAction(Actions.NEW_QUERY_GROUP, null);
      expect(queryStore.queryGroups().length).toEqual(1);
      
      const queryGroupId = queryStore.queryGroups()[0].queryGroupId;
      expect(queryStore.queriesForGroup(queryGroupId).length).toEqual(0);
      DispatcherAction(Actions.NEW_QUERY, { queryGroupId: queryGroupId, type: 'text' });
      
      const queries = queryStore.queriesForGroup(queryGroupId);
      expect(queries.length).toEqual(1);
      expect(queries[0].queryGroupId).toEqual(queryGroupId);
      expect(queries[0].type).toEqual('text');
      expect(queries[0].id).not.toBe(null);
    });
    
    it('removes a query from a given query grou', () => {
      expect(queryStore.queryGroups().length).toEqual(0);
      DispatcherAction(Actions.NEW_QUERY_GROUP, null);
      expect(queryStore.queryGroups().length).toEqual(1);
      
      const queryGroupId = queryStore.queryGroups()[0].queryGroupId;
      expect(queryStore.queriesForGroup(queryGroupId).length).toEqual(0);
      DispatcherAction(Actions.NEW_QUERY, { queryGroupId: queryGroupId, type: 'text' });
      
      let queries = queryStore.queriesForGroup(queryGroupId);
      expect(queries.length).toEqual(1);
      const query = queries[0];
      
      DispatcherAction(Actions.REMOVE_QUERY, { 
        queryGroupId: queryGroupId,
        id: query.id 
      });
      
      queries = queryStore.queriesForGroup(queryGroupId);
      expect(queries.length).toEqual(0);
    });
    
  });

  describe('geo queries', () => {
    
    let _queryGroupId1 = null;
    let _queryGroupId2 = null;
    
    beforeEach(() => {
      DispatcherAction(Actions.NEW_QUERY_GROUP, null);
      DispatcherAction(Actions.NEW_QUERY_GROUP, null);
      expect(queryStore.queryGroups().length).toEqual(2);
      
      _queryGroupId1 = queryStore.queryGroups()[0].queryGroupId;
      _queryGroupId2 = queryStore.queryGroups()[1].queryGroupId;
    });
    
    it('created by map drawing', () => {
      DispatcherAction(Actions.NEW_GEO_QUERY_SHAPE, {
        valid: true,
        bounds: {
          sw: { lat: 1, lng: 2 },
          ne: { lat: 3, lng: 4 }
        }  
      });
      
      const qg1Queries = queryStore.queriesForGroup(_queryGroupId1);
      const qg2Queries = queryStore.queriesForGroup(_queryGroupId2);
      
      expect(qg1Queries.length).toEqual(1);
      expect(qg2Queries.length).toEqual(1);
      
      expect(qg1Queries[0].id).not.toBe(null);
      expect(qg2Queries[0].id).not.toBe(null);
      
      expect(qg1Queries[0].id).not.toEqual(qg2Queries[0].id);
      expect(qg1Queries[0].shapeId).toEqual(qg2Queries[0].shapeId);
    });
    
    //*****************************************************************************
    //*****************************************************************************
    it('created by user input', () => {
      DispatcherAction(Actions.NEW_QUERY, {
        queryGroupId: _queryGroupId1,
        type: "geo"
      });
      
      let qg1Queries = queryStore.queriesForGroup(_queryGroupId1);
      let qg2Queries = queryStore.queriesForGroup(_queryGroupId2);
      
      expect(qg1Queries.length).toEqual(1);
      expect(qg2Queries.length).toEqual(0);
      
      expect(qg1Queries[0].id).not.toBe(null);    
      expect(qg1Queries[0].shapeId).toBe(undefined);
        
      // simulate user input
      DispatcherAction(Actions.QUERY_CHANGED, {
        id: qg1Queries[0].id,
        queryGroupId: _queryGroupId1,
        valid: true,
        shapeId: null,
        bounds: {
          sw: { lat: 1, lng: 2 },
          ne: { lat: 3, lng: 4 }
        }  
      });
      
      // there should still be only one query and it should now have a shapeID
      qg1Queries = queryStore.queriesForGroup(_queryGroupId1);
      
      const shapeId = qg1Queries[0].shapeId;
      expect(qg1Queries.length).toEqual(1);
      expect(qg2Queries.length).toEqual(0);
      expect(qg1Queries[0].shapeId).not.toBe(undefined);
      expect(qg1Queries[0].bounds.sw.lat).toEqual(1);
      expect(qg1Queries[0].bounds.sw.lng).toEqual(2);
      expect(qg1Queries[0].bounds.ne.lat).toEqual(3);
      expect(qg1Queries[0].bounds.ne.lng).toEqual(4);
      
      // simulate user input
      DispatcherAction(Actions.QUERY_CHANGED, {
        id: qg1Queries[0].id,
        queryGroupId: _queryGroupId1,
        valid: true,
        shapeId: shapeId,
        bounds: {
          sw: { lat: 5, lng: 6 },
          ne: { lat: 7, lng: 8 }
        }  
      });
      
      qg1Queries = queryStore.queriesForGroup(_queryGroupId1);
      qg2Queries = queryStore.queriesForGroup(_queryGroupId2);
      
      expect(qg1Queries.length).toEqual(1);
      expect(qg2Queries.length).toEqual(0);
      expect(qg1Queries[0].shapeId).toEqual(shapeId);
      expect(qg1Queries[0].bounds.sw.lat).toEqual(5);
      expect(qg1Queries[0].bounds.sw.lng).toEqual(6);
      expect(qg1Queries[0].bounds.ne.lat).toEqual(7);
      expect(qg1Queries[0].bounds.ne.lng).toEqual(8);
      
      
    }); // end created by user
    
    //*****************************************************************************
    //*****************************************************************************
    it('updating drawn query by user input', () => {
            DispatcherAction(Actions.NEW_GEO_QUERY_SHAPE, {
        valid: true,
        bounds: {
          sw: { lat: 1, lng: 2 },
          ne: { lat: 3, lng: 4 }
        }  
      });
      
      let qg1Queries = queryStore.queriesForGroup(_queryGroupId1);
      let qg2Queries = queryStore.queriesForGroup(_queryGroupId2);
      
      expect(qg1Queries.length).toEqual(1);
      expect(qg2Queries.length).toEqual(1);
      
      expect(qg1Queries[0].id).not.toBe(null);
      expect(qg2Queries[0].id).not.toBe(null);
      
      expect(qg1Queries[0].id).not.toEqual(qg2Queries[0].id);
      expect(qg1Queries[0].shapeId).toEqual(qg2Queries[0].shapeId);
      
      // simulate user input
      DispatcherAction(Actions.QUERY_CHANGED, {
        id: qg1Queries[0].id,
        queryGroupId: _queryGroupId1,
        valid: true,
        shapeId: qg1Queries[0].shapeId,
        bounds: {
          sw: { lat: 5, lng: 6 },
          ne: { lat: 7, lng: 8 }
        }  
      });
      
      // modifying the shape above should have changed the bounds for 
      // all of the queries sharing the shapeId
      qg1Queries = queryStore.queriesForGroup(_queryGroupId1);
      qg2Queries = queryStore.queriesForGroup(_queryGroupId2);
      
      expect(qg1Queries.length).toEqual(1);
      expect(qg2Queries.length).toEqual(1);
      expect(qg1Queries[0].shapeId).toEqual(qg2Queries[0].shapeId);
      expect(qg1Queries[0].bounds.sw.lat).toEqual(5);
      expect(qg1Queries[0].bounds.sw.lng).toEqual(6);
      expect(qg1Queries[0].bounds.ne.lat).toEqual(7);
      expect(qg1Queries[0].bounds.ne.lng).toEqual(8);
      
      expect(qg2Queries[0].bounds.sw.lat).toEqual(5);
      expect(qg2Queries[0].bounds.sw.lng).toEqual(6);
      expect(qg2Queries[0].bounds.ne.lat).toEqual(7);
      expect(qg2Queries[0].bounds.ne.lng).toEqual(8);
    })
    
  });
  
});