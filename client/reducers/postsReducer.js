import * as types from '../constants/actionTypes';

const initialState = {
  // title: 'Noise Disturbance',
  // steet_name: 'Codesmith HQ',
  // details: 'Reports of excessive hollering and clapping noise',
  // time: '6:30pm',
  // image_url: 'https://static.frontendmasters.com/assets/teachers/sentance/thumb@2x.jpg',
  // video_url: 'https://www.youtube.com/embed/sqAwvpw_FKc',
  // expandedPost: false,
  title: null,
  street_name: null,
  details: null,
  time: null,
  image_url: null,
  video_url: null,
  expandedPost: false,
  comments: [],
  incident_id: null
};

const postsReducer = (state=initialState, action) => {

  switch (action.type){
    case types.SET_EXPANDED_POST:
      return {
        ...state,
        expandedPost: action.payload
      };

    case types.CHANGE_ACTIVE_POST:
      //console.log("incident", action.allIncidents)
      // console.log('actionPayload', action.payload)
      for (let incident of action.allIncidents){
        //console.log('test', incident.incident_id, action.payload)
        if (incident.incident_id === action.payload){
          // console.log('found incident', incident);
          return {
            ...state,
            ...incident,
            incident_id : action.payload
          };
        }
        
      }
      return {
        ...state,
      };

    case types.GET_COMMENTS:
      const newComments = action.payload;
      return {
        ...state,
        comments: [...newComments]
      };

    case types.POST_COMMENT:
      const commentsAfterPosting = [...state.comments];
      commentsAfterPosting.push(action.payload);
      return {
        ...state,
        comments: [...commentsAfterPosting]
      };
      

    default:
      return state;
  }

  
}


export default postsReducer;