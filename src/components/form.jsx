import React from 'react';
import ReactDOM from 'react-dom';
import _uniqueId from 'lodash/uniqueId';
import semanticUI from './react-semantic';

export default React.createClass({

  getInitialState ( ) {
    return {
      inputs: {},
      children: [],
      values: {},
      rules: {},
      validationErrors: {}
    }
  },
  
  componentDidMount ( ) {
    // $.fn.form.settings.rules = ( param ) => {
    //   console.log("validating!");
    //   return false;
    // }
    
    this._registerInputs(this.props.children);
    
    $(ReactDOM.findDOMNode(this)).form({
      on: 'change',
      fields: {
        doot: 'empty'
      }
    });
  },
  
  componentWillUnMount ( ) {
    React.Children.forEach(this.state.children, (child) => {
      delete $.fn.form.settings.rules[child.props.name];
    });
  },
    
  _registerInputs ( children ) {
    let state = this.state;
    let clonedChildren = [];
    let rules = {};
    
    React.Children.forEach(children, (child) => {
      if ( child.props.name ) {
        let doot = React.cloneElement(child, {
            key: child.key,
            attachToForm: this._attachToForm,
            detachFromForm: this._detachFromForm,
            didValidate: this._inputDidValidate
          });
        clonedChildren.push(doot);        
      }
      else {
        console.log("child missing name, skipping");
      }
    });
    
    state.children = clonedChildren;
    state.rules = rules;
    this.setState(state);
  },
  
  _attachToForm ( component ) {
    this.state.inputs[component.props.name] = component;
    this.state.values[component.props.name] = component.state.value;
  },
  
  _detachFromForm ( component ) {
    delete this.state.inputs[component.props.name];
  },
  
  _inputDidValidate ( component, valid, message ) {
    let state = this.state;
    let componentName = component.props.name;

    if ( valid ) {
      if ( state.validationErrors[componentName] ) {
        delete state.validationErrors[componentName];
      }
    }
    else {
      if ( !state.validationErrors[componentName] ) {
        state.validationErrors[componentName] = [];
      }
       
      if ( state.validationErrors[componentName].indexOf(message) < 0 ) {
        state.validationErrors[componentName].push(message);
      }
    }
    
    this.setState(state);
    let errors = this._getValidationErrorArray();
    if ( errors.length > 0 ) {
      $(ReactDOM.findDOMNode(this)).form("add errors", errors);
    }
    else {
      $(ReactDOM.findDOMNode(this)).form("validate form");
    }
  },
  
  _getValidationErrorArray ( ) {
    let errors = [];
    for ( let key in this.state.validationErrors ) {
      let errorArray = this.state.validationErrors[key];
      errors = errors.concat(errorArray);
    }
    
    return errors;
  },
  
  _submit ( ) {
    let settings = {
      inline: true,
      on: 'blur',
      onSuccess: () => {
        console.log("success");
      }
    };
    $(ReactDOM.findDOMNode(this)).form(this.state.rules, settings);
  },
    
  render ( ) {    
    return (
      <form className="ui form">
        {this.state.children}
        
        <div className="ui button" onClick={this._submit}>Submit</div>
        <div className="ui error message">
        </div>
      </form>
    );
  }
});