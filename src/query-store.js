import {EventEmitter} from 'fbemitter';
import { Actions } from './actions';
import Dispatcher from './dispatcher';
import _uniqueId from 'lodash/uniqueId';
import _find from 'lodash/find';
import QueryType from './query-type';

class QueryStore extends EventEmitter {
  
  //*****************************************************************************
  //*****************************************************************************
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
        self.processRemoveQueryAction(payload.data.queryGroupId, payload.data.id);
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
        
        // updating existing shape
        if ( payload.data.shapeId && payload.data.shapeId !== undefined ) {
          let existingQueries = this.queriesWithShape(payload.data.shapeId);
          existingQueries.forEach((queryToUpdate) => {
            this._updateQuery(queryToUpdate, payload.data);
          })
        } 
        
        // creating new shape (user inputted value to query)
        else {
          let qg = this.findQueryGroupById(payload.data.queryGroupId);
          const idx = this.indexOfQueryInQueryGroup(payload.data.id, payload.data.queryGroupId)
          if ( qg && idx >= 0 ) {
            let query = qg.queries[idx];
            this._updateQuery(query, payload.data);
          }
        }
        
        self.emit(payload.actionType, self._queryGroups);

        break;
        
      case Actions.NEW_GEO_QUERY_SHAPE:
        const bounds = payload.data.bounds;
        const shapeId = _uniqueId();
        
        self._queryGroups.forEach((queryGroup) => {
          queryGroup.queries.push({id: _uniqueId(), queryGroupId: queryGroup.queryGroupId, shapeId: shapeId, type: QueryType.GEO, bounds: bounds});
        });
        
        self.emit(payload.actionType, self._queryGroups);
        this._showShapeForQuery({ valid: payload.data.valid, shapeId: shapeId, bounds: bounds });        
        break;
        
      case Actions.HIGHLIGHT_RECTANGLE:
        self.emit(payload.actionType, payload.data);
        break;
        
      default:
        break;
      }
    });
  }
  
  //*****************************************************************************
  //*****************************************************************************
  _showShapeForQuery ( query ) {
    if ( query.valid ) {
      this.emit(Actions.SHOW_RECTANGLE, {
        id: query.shapeId, 
        sw: query.bounds.sw,
        ne: query.bounds.ne
      });  
    }
  }
  
  //*****************************************************************************
  //*****************************************************************************
  _queryChanged ( originalQuery, updatedQuery ) {
    switch ( originalQuery.type ) {
    case QueryType.GEO:
    
      originalQuery.valid = updatedQuery.valid;
      originalQuery.bounds = updatedQuery.bounds;
      
      // the the query already has a shape assigned to it
      if ( originalQuery.shapeId ) {
        // N/A
      }
      // otherwise create a new shape
      else {
        originalQuery.shapeId = _uniqueId();
      }
      
      break;
    default:
      break;
    }
    
    return originalQuery;
  }
  
  //*****************************************************************************
  //*****************************************************************************
  createQueryGroup ( ) {
    this._queryGroups.push({
      queryGroupId: _uniqueId(),
      queries: []
    });
  }
  
  //*****************************************************************************
  //*****************************************************************************
  findQueryGroupById ( id ) {    
    for ( const idx in this._queryGroups ) {
      const qg = this._queryGroups[idx];
      if ( qg.queryGroupId === id ) {
        return qg;
      }
    }

    return null;
  }
  
  //*****************************************************************************
  //*****************************************************************************
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
  
  //*****************************************************************************
  //*****************************************************************************
  indexOfQueryInQueryGroup ( queryId, queryGroupId ) {
    const qg = this.findQueryGroupById(queryGroupId);
    if ( qg ) {
      for ( let i = 0; i < qg.queries.length; i++ ) {
        const query = qg.queries[i];
        if ( query.id === queryId ) {
          return i;
        }
      }
    }
    return -1;
  }
  
  //*****************************************************************************
  //*****************************************************************************
  queries ( ) {
    return this._queries;
  }
  
  //*****************************************************************************
  //*****************************************************************************
  queryGroups ( ) {
    return this._queryGroups;
  }
  
  //*****************************************************************************
  //*****************************************************************************
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
  processRemoveQueryAction ( queryGroupId, id ) {
    
    if ( queryGroupId ) {
      this.removeQueryAndShape(queryGroupId, id);
      // const removedQuery = this.removeQuery(queryGroupId, id);
          
      //   if ( removedQuery && removedQuery.shapeId ) {
      //     const shapes = this.queriesWithShape(removedQuery.shapeId)
      //     if ( shapes.length === 0 ) {
      //       this.removeShape(removedQuery.shapeId);
      //     }
      //   }
        
      //   this.emit(payload.actionType, self._queryGroups);
    }
    else {
      // get the queries from all the query groups
      const queriesToRemove = this._queryGroups.map((qg) => {
        return qg.queries;
      })
      // result is an array of arrays, flatten it
      .reduce((aggregate, queries) => {
        return aggregate.concat(queries);
      }, [])
      // find just the queries we need to remove
      .filter((query) => {
        return query.shapeId === id;
      });
      
      queriesToRemove.forEach((query) => { 
        this.removeQueryAndShape(query.queryGroupId, query.id); 
      });
    }
  }
  
  //*****************************************************************************
  //*****************************************************************************
  removeQueryAndShape ( queryGroupId, id ) {
    const removedQuery = this.removeQuery(queryGroupId, id);
      
    if ( removedQuery && removedQuery.shapeId ) {
      const shapes = this.queriesWithShape(removedQuery.shapeId)
      if ( shapes.length === 0 ) {
        this.removeShape(removedQuery.shapeId);
      }
    }
    
    this.emit(Actions.REMOVE_QUERY, this._queryGroups);
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
  
  //*****************************************************************************
  //*****************************************************************************
  _updateQuery ( query, updates ) {
    this._queryChanged(query, updates);
    
    if ( query.type === QueryType.GEO ) {
      this._showShapeForQuery(query);
    }
  }
  
};

export default (new QueryStore());
