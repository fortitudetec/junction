import React from 'react';
import ReactDOM from 'react-dom';
import ValidatedComponent from './validated-component';
import _uniqueId from 'lodash/uniqueId';
import semanticUI from './react-semantic';

const TextInput = React.createClass({

  propTypes: {
    validation: React.PropTypes.func,
    value: React.PropTypes.string
  },
  
  getInitialState ( ) {
    return {
      validation: null, 
      value: null,
      valid: true
    }
  },
  
  componentDidMount ( ) {
    if ( this.props.attachToForm ) {
      this.props.attachToForm(this);
    }
  },
  
  componentWillUnmount ( ) {
    if ( this.props.detachFromForm ) {
      this.props.detachFromForm(this);
    }
  },
  
  _changed ( e ) {
    console.log("text input changed: " + e.target.value);
    if ( this.props.validation ) {
      let state = this.state;
      let validationResult = this.props.validation(this, e);
      
      state.valid = validationResult.valid;
      
      if ( !validationResult.valid ) {
        this.props.didValidate(this, validationResult.valid, validationResult.message);
      }
      else {
        this.props.didValidate(this, validationResult.valid, null);
      }
      
      this.setState(state);
    }
  },
    
  render ( ) {
    
    let classValue = "field";
    
    if ( !this.state.valid ) {
      classValue += " error";
    }
    
    return (
      <div className={classValue} >
        <label>TextField</label>
        <ValidatedComponent>
          <input type="text" name={this.props.name} onchange={this._changed} />
        </ValidatedComponent>
      </div>
    );
  }
});

export default TextInput;