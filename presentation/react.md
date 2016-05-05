# Introduction to React
---

# React

React is a JavaScript library developed by Facebook for creating reusable views.

---

## Why React?

Creating interactive and modern web controls is easy, but making them reusable, generic, and idempotent is not.

React views declare state explicitly.

---

## What React isn't

- It is not a framework
- It is not a language
- It does not manage models
- It is not an all inclusive package

---

## Uses
Can be used for creating single page applications

Can be used with traditional server-oriented applications

Can be used isomorphically

React is *not* tied to a specific web technology

---

## How it Works

- You need an entry point for React components on your page, this is typically a `div`
- Your component is declared in an included JavaScript file
- Your component renders itself into the `div` when the page loads

---
## Example Component
Declaration:

```javascript
import React from 'react';

export default React.createClass({
  getInitialState() { return {}; },
  getDefaultProps() { return {}; },
  componentDidMount() { },
  componentWillUnmount() { },
  componentDidUpdate () { },
  componentWillReceiveProps() { },
  render ( ) { return <h1>Hello world</h1>; } // <-- JSX, not HTML!
});
```

Usage:

```
<ReactComponent />
```

---

## JSX (JavaScript Syntax eXtension)

JSX is an optional Domain Specific Language for declaring the layout and content of your view

JSX returned by a component's render method is transpiled to real-deal JavaScript

---

## Component Interaction
React does not support two-way data binding by design.

Components are stateful, but state is only updated when you request it.

Components can provide properties to nested components, but there is no communication, or shared state.

*For example, there is no way for a button component to directly update another component when clicked*

---
## Component with Properties
Properties are passed to components as tag attributes.

```javascript
import React from 'react';

export default React.createClass({
  getInitialState() { return {}; },
  getDefaultProps() { return { greeting: 'Hello World!' }; },
  componentDidMount() { },
  componentWillUnmount() { },
  componentDidUpdate () { },
  componentWillReceiveProps() { },
  render ( ) { return <h1>{this.props.greeting}</h1>; }
});
```

Usage:

```javascript
<ReactComponent greeting="Hello to a world with properties" />
```

---
## Events
React supports the typical JavaScripty event types on your components.

```javascript
- onFocus
- onKeyPress
- onKeyUp
- onFocus
- onBlur
- ...
```

---
## Event Example
Print a message when the mouse enters the element

```javascript
import React from 'react';

export default React.createClass({
  getInitialState() { return {}; },
  getDefaultProps() { return { greeting: 'Hello World!' }; },
  componentDidMount() { },
  componentWillUnmount() { },
  componentDidUpdate () { },
  componentWillReceiveProps() { },
  render ( ) { return <h1 onMouseEnter={() => { console.log(this.props.greeting)}} >{this.props.greeting}</h1>; }
});
```

---

## Complex Interactions (Flux)
Facebook 'invented' Flux to deal with complex interactions. 

Simply put, React applications should be event driven. 

If a button press is supposed to change the application's state, it posts an event. 

JavaScript classes / React components can register to receive relevant events.

---
## Flux Architecture

![inline](https://facebook.github.io/flux/img/flux-simple-f8-diagram-with-client-action-1300w.png)

---

## A Little Code...

--- 

## References
- Code and presentation available at [https://github.com/fortitudetec/junction](https://github.com/fortitudetec/junction)
- [React Github Page](https://facebook.github.io/react/)
- [Webpack Github Page](https://webpack.github.io)
