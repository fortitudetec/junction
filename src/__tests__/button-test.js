import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import Button from '../components/button.jsx';

jest.unmock('jquery');

describe('Button', () => {
  
  it('label defaults to Button', () => {
    const callback = ( ) => { };
    const button = <Button clickCallback={callback}>button</Button>;
    TestUtils.renderIntoDocument(button);
    
   expect(button.props.children).toEqual("button");
   expect(button.props.clickCallback).toEqual(callback);
  });
  
});