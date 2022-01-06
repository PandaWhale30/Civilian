import * as types from '../constants/actionTypes';
import axios from 'axios';
import { defaultMaxListeners } from 'events';

const allIncidents = [];
axios.get(`api/incidents`)
.then(({data}) => {
    //console.log('data', data);
    for(let incident of data){
        allIncidents.push(incident)
    }
})
.catch(console.error);

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