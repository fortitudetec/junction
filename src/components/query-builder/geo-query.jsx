import React from 'react';
import ReactDOM from 'react-dom';
import semanticUI from '../react-semantic';

export default React.createClass({
  
  propTypes: {
    onChange: React.PropTypes.func
  },
  
  componentDidMount ( ) {
    // let dom = $(ReactDOM.findDOMNode(this));
    // dom.form({
    //   on: 'blur',
    //   fields: {
    //     regex: {
    //       identifier: 'swlat',
    //       rules: [
    //         {
    //           type: 'regExp[/(^-?[0-9](\.\d+)*$)|(^-?[1-8][0-9](\.\d+)*$)|(^-?90(\.0+)*)$/]'
    //         }
    //       ]
    //     },
    //     swlng: {
    //       identifier: 'swlng',
    //       rules: [
    //         {
    //           type: 'decimal',
    //           prompt: 'Soutwest longitude must be a decimal'
    //         }
    //       ]
    //     }
    //   }
    // })
  },
  
  _validateLatitude ( value ) {
    return /(^-?[0-9](\.\d+)*$)|(^-?[1-8][0-9](\.\d+)*$)|(^-?90(\.0+)*)$/.test(value);
  },
  
  didChange ( event ) {    
    // let dom = $(ReactDOM.findDOMNode(this)).form('add errors', ["one", "two"]);
  },
  
  render ( ) {
    return (
      <div className="ui form">
        <div className="field">
          <label>Southwest Corner</label>
          <div className="two fields">
            <input type="text" placeholder="Latitude" name="swlat" onChange={this.didChange} />
            <input type="text" placeholder="Longitude" name="swlng" />
          </div>
        </div>
        
        <div className="field">
          <label>Northeast Corner</label>
          <div className="two fields">
            <input type="text" placeholder="Latitude" />
            <input type="text" placeholder="Longitude" />
          </div>
        </div>
        <div className="ui error message"></div>
      </div>
    );
  }
});