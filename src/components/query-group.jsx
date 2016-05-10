import React from 'react';
import {Actions, RemoveQueryAction, RemoveQueryGroup, DispatcherAction} from '../actions';
import ReactDOM from 'react-dom';
import DataSource from './datasource';
import BooleanDiv from './boolean-div';
import QueryForm from './query-builder/query-form';
import DatePicker from './query-builder/date-picker';
import GeoQuery from './query-builder/geo-query';
import CloseDiv from './close-div';
import Button from './button';
import _uniqueId from 'lodash/uniqueId';
import semanticUI from './react-semantic';

export default React.createClass({

  propTypes: {
    id: React.PropTypes.string.isRequired,
    queries: React.PropTypes.array.isRequired,
  },

  getInitialState ( ) {
    return {
      show: false,
      showCloseButton: false,
      queries: this.props.queries.map((this._createQueryComponent)),
      id: this.props.id,
      selectedTable: null,
      tables: ['Table1', 'Table2', 'Table3']
    }
  },
  
  componentDidMount ( ) {
  },
  
  componentWillReceiveProps ( newProps ) {
    let state = this.state;
    state.queries = newProps.queries.map(this._createQueryComponent);
    this.setState(state);
  },
  
  _createQueryComponent ( query ) {
    let component = null;
    
    switch ( query.type ) {
    case "text":
      component = (
        <QueryForm key={query.id} id={query.id} queryGroupId={this.props.id} />
      );
      break;
    case "date":
      component = (
        <DatePicker key={query.id} id={query.id} queryGroupId={this.props.id} />
      );
      break;
    case "geo":
      component = (
        <GeoQuery onChange={this.geoQueryChange} key={query.id} id={query.id} queryGroupId={this.props.id} bounds={query.bounds} shapeId={query.shapeId} />
      );
      break;
    default:
      break;
    }
    
    return component;
     
  },
  
  dropDownItemSelected ( id ) {
    let state = this.state;
    state.show = true;
    state.showCloseButton = true;
    state.queries = [];
    state.selectedTable = this.state.tables[parseInt(id)];
    this.setState(state);
  },
  
  addQuery ( type ) {
    DispatcherAction(Actions.NEW_QUERY, { queryGroupId: this.props.id, type: type });
  }, 
  
  removeQuery ( query ) {
    DispatcherAction(Actions.REMOVE_QUERY, { 
      queryGroupId: this.state.id,
      id: query.key
    });
  },
  
  _removeQueryGroup ( ) {
    DispatcherAction(Actions.REMOVE_QUERY_GROUP, { queryGroupId: this.state.id });
  },
  
  _newQueryGroup ( id ) {
    DispatcherAction(Actions.NEW_QUERY_GROUP, null);
  },
  
  geoQueryChanged ( ) {
  },
  
  render ( ) {  
    
    let tableSelector = null;
    tableSelector = <DataSource options={this.state.tables} label="Datasource" selected={this.dropDownItemSelected} />; 
    
    const queryRows = this.state.queries.map((query) => {
      return (
        <tr key={_uniqueId()}>
          <td>
            {query}
          </td>
          <td style={{verticalAlign: 'top'}}>
            <a href="#" onClick={this.removeQuery.bind(this, query)}>
              <i className="icon remove"></i>
            </a>
          </td>
        </tr>
      );
    });
    
    const lastRow = (() => {
      if ( this.state.queries.length > 0 ) {
        return (
          <tr>
            <td><strong>New Query</strong></td>
            <td>
              <a href="#" onClick={this._newQueryGroup}>
                <i className="icon plus"></i>
              </a>
            </td>
          </tr>
        );
      }
      
      return null;
    })();
      
    return (
      <table className="ui table black striped" id={this.state.id}>
        <thead>
          <tr>
            <th className="fourteen wide">
              {tableSelector}
            </th>
            <th className="two wide">
              <Button type="circular icon red mini" clickCallback={this._removeQueryGroup}>
                <i className="icon remove"></i>
              </Button>
            </th>
          </tr>
        </thead>
        
        <tbody>
          <tr>
            <td>
              <BooleanDiv show={this.state.show}>
                <ul className="no-list-style">
                  <li className="horizontal pleasant-padding">
                    <a href='#' onClick={this.addQuery.bind(this, 'text')}>
                      <i className="align left icon"></i>
                    </a>
                  </li>
                  <li className="horizontal pleasant-padding">
                    <a href='#' onClick={this.addQuery.bind(this, 'date')}>
                      <i className="calendar icon"></i>
                    </a>
                  </li>
                  <li className="horizontal pleasant-padding">
                    <a href='#' onClick={this.addQuery.bind(this, 'geo')}>
                      <i className="world icon"></i>
                    </a>
                  </li>
                </ul>
                
                
              </BooleanDiv>
            </td>
          </tr>
          {queryRows}
          {lastRow}
        </tbody>
      </table>
    );
  }
});
