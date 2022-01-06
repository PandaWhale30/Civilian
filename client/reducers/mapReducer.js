import * as types from '../constants/actionTypes';
import axios from 'axios';
import { defaultMaxListeners } from 'events';

// const allIncidents = [];
// axios.get(`api/incidents`)
// .then(({data}) => {
//     //console.log('data', data);
//     for(let incident of data){
//         allIncidents.push(incident)
//     }
// })
// .catch(console.error);
const allIncidents= [{
  details: "something is afoul",
  image_url: "www.png",
  incident_id: "5",
  location_id: null,
  street_name: "163 Branham Ln, San Jose, CA 95136",
  time: "1/3/2022, 8:57:30 AM",
  title: "Burger robber at Mcdonald's!",
  user_id: null,
  video_url: "",
}]

const initialState = {
  pinLocations: [],
  allIncidents: allIncidents
}

const mapReducer = (state = initialState, action) => {
  switch (action.type){

    case types.GET_COORDINATES: 
      const newPins = [...action.payload];
      return {
        ...state,
        pinLocations: newPins
      }

    case types.POST_EVENT:
      const newIncidents = [...state.allIncidents];
      newIncidents.push(action.payload);
      return{
        ...state,
        allIncidents : [...newIncidents]
      }
    default:
      return state;

      }
}
export default mapReducer;