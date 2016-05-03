import {EventEmitter} from 'fbemitter';
import { Actions } from './actions';
import Dispatcher from './dispatcher';
import _uniqueId from 'lodash/uniqueId';
import _find from 'lodash/find';

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
        const removedQuery = self.removeQuery(payload.data.queryGroupId, payload.data.id);
        
        if ( removedQuery && removedQuery.shapeId ) {
          const shapes = self.queriesWithShape(removedQuery.shapeId)
          if ( shapes.length === 0 ) {
            self.removeShape(removedQuery.shapeId);
          }
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
        // self.emit(payload.actionType, se)
        break;
        
      case Actions.NEW_GEO_QUERY_SHAPE:
        const bounds = payload.data.bounds;
        const shapeId = _uniqueId();
        
        self._queryGroups.forEach((queryGroup) => {
          queryGroup.queries.push({id: _uniqueId(), shapeId: shapeId, type: "geo", bounds: bounds});
        });
        
        self.emit(payload.actionType, self._queryGroups);
        self.emit(Actions.SHOW_RECTANGLE, {
          id: shapeId, 
          sw: bounds.sw,
          ne: bounds.ne
        });
        
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
  
  findQueryById ( id ) { 
    const foundQueries = this._queryGroups.map((qg) => {
      return qg.queries;
    }).reduce((aggregate, qg) => {
      return aggregate.concat(qg.queries);
    }).filter((query) => {
      return query && query.id === id
    });
    
    return foundQueries;
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
  
  //*****************************************************************************
  //*****************************************************************************
  findQueryGroupsByShapeId ( shapeId ) {
    let queryGroups = [];
    
    this.state._queries.filter((qg) => {
      return _find(qg.queries, (query) => {
        return query.props.shapeId === shapeId;
      }) !== undefined;
    });
    
    return queryGroups;
  }
  
  //*****************************************************************************
  //*****************************************************************************
  queriesWithShape ( shapeId ) {
    if ( shapeId ) {
      return this._queryGroups.map((qg) => {
        return qg.queries.filter((query) => {
          return query.shapeId && query.shapeId === shapeId;
        });
      }).reduce((aggregate, queries) => {
        return aggregate.concat(queries);
      }, []);
    }
    
    return [];
  }
  
  //*****************************************************************************
  //*****************************************************************************
  removeQuery ( queryGroupId, queryId ) {
    let removedQuery = null;
    let qg = this.findQueryGroupById(queryGroupId);
    
    if ( qg ) {
      qg.queries = qg.queries.filter((query) => {
        
        // in theory there should be only one query with the supplied id,
        // the query ids should be unique
        if ( query.id === queryId ) {
          removedQuery = query;
        }
        
        return query.id !== queryId;
      });
    }
    
    return removedQuery
  }
  
  //*****************************************************************************
  //*****************************************************************************
  removeShape ( shapeId ) {
    this.emit(Actions.REMOVE_RECTANGLE, { id: shapeId });
  }
  
  //*****************************************************************************
  //*****************************************************************************
  reset ( ) {
    this._queries = [];
    this._queryGroups = [];
  }
};

export default (new QueryStore());
