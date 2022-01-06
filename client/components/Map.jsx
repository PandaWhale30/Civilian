import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import ReactMapGL, {Marker} from 'react-map-gl';
import { connect } from 'react-redux';
import * as actions from '../actions/actions';
import { bindActionCreators } from 'redux';
import CustomMapController from './CustomMapController';
import logo from '../../assets/danger-pin.png'
import * as mapboxgl from 'mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';

console.log('in Map.jsx')
//destructuring the state to get lng, lat, zoom from redux state and put them into prop obj 

const mapStateToProps = ({map: {viewport, pinLocations, allIncidents}, user: {isLoggedIn}}) => ({
  viewport,
  pinLocations,
  allIncidents,
  isLoggedIn
})

// allows us to use the actions in actions.js without having to wrap them so that we can invoke those functions
// directly even though they were not created in this page
const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

const mapController = new CustomMapController();

const Map = (props) => {
  useEffect(() => {
    props.getCoordinates();
  }, [])

  useEffect(() => {
    props.getCoordinates();
  }, [props.allIncidents])

  return (
    
    <ReactMapGL
      {...props.viewport} 
      height='100%'
      width='100%' 
      mapboxApiAccessToken = {process.env.REACT_APP_MAPBOX_ACCESS_TOKEN} 
      
      // on dbl click => get coordinates, open incident modal, create a pin and send off to reducer 
      onDblClick={({ lngLat }) => {
        if (props.isLoggedIn){
          props.saveUserCoords(lngLat);
          props.onOpenIncidentFormClick();
        }
      }}
      mapStyle='mapbox://styles/ruzeb/ckxzlf0mk9gn714qei4cq6lm1' 
      doubleClickZoom={false}
      attributionControl={false}
      onViewportChange={(newViewport) => {props.setMap(newViewport)}
    }>
        {props.pinLocations.map((el, key) => {
          return (
            
          <Marker key={key + 1} latitude={el.latitude} longitude={el.longitude} address={el.address} id={el.id}>
          {/* button onclick post pops up */}
            <button className='map-pin' onClick={(e) => {props.changeActivePost(el.id);props.getCommentsByIncident(el.id);}} style={{backgroundColor: 'transparent', border: 'none'}}>
              <img src={logo} alt='pin' style={{backgroundColor: 'transparent', height: '50px', width: '50px'}}/>
            </button>
          </Marker>
          )
        }
        )}
    </ReactMapGL>
  );
}
export default connect(mapStateToProps, mapDispatchToProps)(Map);