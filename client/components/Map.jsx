import * as React from 'react';
import { useState, useEffect, useRef, useCallback } from 'react';
import ReactMapGL, {Marker, GeolocateControl, FlyToInterpolator} from 'react-map-gl';
import { connect } from 'react-redux';
import * as actions from '../actions/actions';
import { bindActionCreators } from 'redux';
import CustomMapController from './CustomMapController';
import logo1 from '../../assets/gray_pin.png';
import logo2 from '../../assets/yellow_pin.png';
import logo3 from '../../assets/danger-pin.png';
import * as mapboxgl from 'mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import Geocoder from "react-map-gl-geocoder";

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

  const [viewport, setViewport] = useState({
    latitude: 40.7128,
    longitude: -74.0060,
    zoom: 13
  });
  useEffect(() => {
    props.getCoordinates();
  }, [])

  useEffect(() => {
    props.getCoordinates();
  }, [props.allIncidents])

  const mapRef = useRef();
  const handleViewportChange = useCallback(
    (newViewport) => setViewport(newViewport),
    []
  );

  const geolocateControlStyle = {
    right: 10,
    top: 10
  };

  const handleGeocoderViewportChange = useCallback(
    (newViewport) => {
      const geocoderDefaultOverrides = { transitionDuration: 4000, transitionInterpolator: new FlyToInterpolator() };
      return handleViewportChange({
        ...newViewport,
        ...geocoderDefaultOverrides
      });
    },
    [handleViewportChange]
  );

  return (
    <ReactMapGL
      ref={mapRef}
      {...viewport} 
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
      onViewportChange={handleViewportChange}
    >
    <GeolocateControl
      style={geolocateControlStyle}
      positionOptions={{enableHighAccuracy: true, transitionDuration: 2000}}
      trackUserLocation={true}
      showUserHeading={true}
      showAccuracyCircle={true}
      onViewportChange={handleGeocoderViewportChange}
    />
    <Geocoder
      mapRef={mapRef}
      onViewportChange={handleGeocoderViewportChange}
      mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}
      position="top-left"
      
    />
    {props.pinLocations.map((el, key) => {
      return (
        
      <Marker key={key + 1} latitude={el.latitude} longitude={el.longitude} address={el.address} id={el.id} severity={el.severity}>
      {/* button onclick post pops up */}
        <button className='map-pin' 
          onClick={(e) => {
            props.changeActivePost(el.id);
            props.getCommentsByIncident(el.id);
            setViewport({
              latitude: el.latitude,
              longitude: el.longitude,
              zoom: 15,
              transitionDuration: 2500,
              transitionInterpolator: new FlyToInterpolator(),
            }
          )}
        } 
          style={{backgroundColor: 'transparent', border: 'none'}}>
          <img src={el.severity === "1" ? logo1 : el.severity === "2" ? logo2 : logo3} alt='pin' style={{backgroundColor: 'transparent', height: '50px', width: '50px'}}/>
        </button>
      </Marker>
      )
    }
    )}
    </ReactMapGL>
  );
}
export default connect(mapStateToProps, mapDispatchToProps)(Map);