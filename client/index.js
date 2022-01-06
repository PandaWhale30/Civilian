import React from 'react';
import ReactDOM from 'react-dom';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import App from './App';
import store from './store';
import Map from './components/Map';
import './stylesheets/styles.css';
import * as mapboxgl from 'mapbox-gl';

console.log('in index.js');

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
