import {EventEmitter} from 'fbemitter';
import { Actions } from './actions';
import Dispatcher from './dispatcher';
import _uniqueId from 'lodash/uniqueId';

class QueryStore extends EventEmitter {
  
  constructor ( dispatcher ) {
    super();
    this._queries = [];
    this._queryGroups = [];
    
    let qg = null;
    
    const createQuery = ( queryGroupId, type ) => {
      return {
        queryGroupId: queryGroupId, 
        type: type,
        id: _uniqueId()
      }
    };
    
    var self = this;
    Dispatcher.register((payload) => {
      switch ( payload.actionType ) {
      case Actions.NEW_QUERY:
        let newQuery = createQuery(payload.data.queryGroupId, payload.data.type);
        qg = self.findQueryGroupById(payload.data.queryGroupId);
        
        if ( qg ) {
          qg.queries.push(newQuery);
        }
        
        self.emit(payload.actionType, self._queryGroups);
        break;
      case Actions.REMOVE_QUERY:
        qg = self.findQueryGroupById(payload.data.queryGroupId);
        
        if ( qg ) {
          qg.queries = qg.queries.filter((query) => {
            return query.id !== payload.data.id;
          });
        }
        
        self.emit(payload.actionType, self._queryGroups);
        break;
      case Actions.REMOVE_QUERY_GROUP:
        const queryGroupId = payload.data.queryGroupId;
        self._queryGroups = self._queryGroups.filter((element) => {
          return element.queryGroupId !== queryGroupId;
        });
        
        self.emit(payload.actionType, self._queryGroups);
        break;
        
      case Actions.NEW_QUERY_GROUP:
        self.createQueryGroup();        
        self.emit(payload.actionType, self._queryGroups);
        break;
        
      case Actions.QUERY_CHANGED:
        let changedElementId = payload.data.id;
        let value = payload.data.newValue;
        console.log(value + " " + changedElementId);
        // self.emit(payload.actionType, se)
        break;
        
      case Actions.NEW_GEO_QUERY_SHAPE:
        const bounds = payload.data.bounds;
        self._queryGroups.forEach((queryGroup) => {
          queryGroup.queries.push({id: _uniqueId, type: "geo", bounds: bounds});
        });
        
        self.emit(payload.actionType, self._queryGroups);
        break;
        
      default:
        break;
      }
    });
  }
  
  createQueryGroup ( ) {
    this._queryGroups.push({
      queryGroupId: _uniqueId(),
      queries: []
    });
  }
  
  findQueryGroupById ( id ) {    
    for ( const idx in this._queryGroups ) {
      const qg = this._queryGroups[idx];
      if ( qg.queryGroupId === id ) {
        return qg;
      }
    }

    return null;
  }
  
  queries ( ) {
    return this._queries;
  }
  
  queryGroups ( ) {
    return this._queryGroups;
  }
  
  queriesForGroup ( queryGroupId ) {
    const group = this.findQueryGroupById(queryGroupId);
    
    if ( group ) {
      return group.queries;
    }
    
    return [];
  }
  
};

export default QueryStore;
