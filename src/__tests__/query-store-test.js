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
  
});