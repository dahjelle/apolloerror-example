import React from 'react';
import ReactDOM from 'react-dom';
import ApolloClient from 'apollo-client';
import {ApolloProvider, connect} from 'react-apollo';
import gql from 'graphql-tag';
import { createStore, combineReducers, applyMiddleware } from 'redux';

const client = new ApolloClient({
  networkInterface: {
    query: function() {
      return new Promise(function(resolve, reject) {
        return resolve({
          data: {
            test: {
              id: 1
            }
          }
        });
      });
    }
  }
});
const store = createStore(
  combineReducers({
    apollo: client.reducer(),
  }),
  applyMiddleware(client.middleware())
);

const Example = function(props) {
  if (props.myQuery.loading) {
    return <div>Loading...</div>;
  }
  if (props.myQuery.errors) {
    console.error(props.myQuery.errors.stack);
    console.error(props.myQuery.errors.networkError.stack);
    return <div>Errors!</div>;
  };
  return <h1>Hello, world!{props.myQuery.doesnt_exist.completely_undefined}</h1>; // throws an error
};

var MyComponent = connect({
  mapQueriesToProps({ownProps, state}) {
    return {
      myQuery: {
        query: gql` {
          test {id}
        }`
      }
    }
  }
})(Example);

ReactDOM.render(
  <ApolloProvider client={client} store={store}>
    <MyComponent />
  </ApolloProvider>,
  document.getElementById('body')
);