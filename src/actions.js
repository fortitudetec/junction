import Dispatcher from './dispatcher';

export const Actions = {
  BUTTON_CLICKED: "BUTTON_CLICKED",
  NEW_QUERY: "NEW_QUERY",
  REMOVE_QUERY: "REMOVE_QUERY",
  QUERY_CHANGED: "QUERY_CHANGED",
  REMOVE_QUERY_GROUP: "REMOVE_QUERY_GROUP",
  NEW_QUERY_GROUP: "NEW_QUERY_GROUP",
  NEW_GEO_QUERY_SHAPE: "NEW_GEO_QUERY_SHAPE",
  SHOW_RECTANGLE: "SHOW_RECTANGLE",
  REMOVE_RECTANGLE: "REMOVE_RECTANGLE",
  HIGHLIGHT_RECTANGLE: "HIGHLIGHT_RECTANGLE"
};

export const DispatcherAction = ( action, userData ) => {
  Dispatcher.dispatch({
    actionType: action,
    data: userData
  });
}