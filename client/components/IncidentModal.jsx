import React from "react";
import { connect } from 'react-redux';
import { postEvent, getCoordinates } from '../actions/actions';
import { AiOutlineCloseCircle } from 'react-icons/ai'
import { IconContext } from 'react-icons';
import logo from '../../assets/danger-pin.png'
import { useState, useEffect } from 'react';

const mapStateToProps = ({map: {allIncidents}}) => ({
  allIncidents
})

const mapDispatchToProps = dispatch => ({
  // create functions that will dispatch action creators
  post: (e) => {
    e.preventDefault();
    console.log(e.target.form);
    dispatch(
      postEvent(
        e.target.form[0].value, 
        e.target.form[1].value, 
        e.target.form[2].value, 
        e.target.form[3].value,
        // e.target.form[4].value
      )
    );
  },
  // refreshPins: () => {
  //   console.log('refreshing pins')
  //   dispatch(getCoordinates());
  // }
});

const IncidentModal = (props) => {
  console.log(props);
  // const [pinLoc, setPinLoc] = useState(props.allIncidents);


  // useEffect(() => {
  //   props.refreshPins();
  // }, [props.allIncidents])
  // setPinLoc => {
  //   useEffect(() => {
  //     props.getCoordinates();
  //   })
  // }
  return (
    <div id="modal-overlay">
      <form id="incident-form" className='form-modal'>
        <IconContext.Provider value={{className: 'exit-modal', size:'1.5em'}}>
          <AiOutlineCloseCircle onClick={(e) => props.onCloseButtonClick()}/>
        </IconContext.Provider>
        <div id="modal-logo-wrapper">
          <img id="logo" src={logo}/>
        </div>
        <div className="input-div">
          <label htmlFor="title">TITLE</label>
          <input className="form-input" type="text" name="title" placeholder="Title of Incident"/>
        </div>
        {/* <div className="input-div">
          <label htmlFor="address">ADDRESS</label>
          <input className="form-input" type="text" name="address" placeholder="Enter the location"/>
        </div> */}
        <div className="input-div">
          <label htmlFor="severity">DANGER</label>
          <input className="form-input" type="text" name="title" placeholder="Title of Incident"/>
        </div>
        <div className="input-div">
          <label htmlFor="details">DETAILS</label>
          <input className="form-input" type="text" name="details" placeholder="Enter any details"/>
        </div>
        <div className="input-div">
          <label htmlFor="image_url">IMAGE URL</label>
          <input className="form-input" type="text" name="image_url" placeholder="Link an image"/>
        </div>
        <div className="input-div">
          <label htmlFor="video_url">VIDEO URL</label>
          <input className="form-input" type="text" name="video_url" placeholder="Link a video"/>
        </div>
        <div id='button-container'>
          <button id="signup-button" className="form-button" onClick={(e) => {props.post(e);props.onCloseButtonClick();}}>Submit</button>
        </div>
      </form>
    </div>
  )
}

export default connect(null, mapDispatchToProps)(IncidentModal);