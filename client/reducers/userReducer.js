import * as types from '../constants/actionTypes';

const initialState = {
  isLoggedIn: false,
  username: '',
  photo: '',
  lngLat: [],
  userComment: '',
  userID: null
};

const userReducer = (state=initialState, action) => {

  switch (action.type){

    case types.GET_USERNAME:
    console.log('get user payload', action.payload);
    return {
      ...state,
      isLoggedIn: true,
      username: action.payload.name,
      photo: action.payload.photo,
      userID: action.payload.user_id
    };

    case types.SAVE_USER_COORDS:
      console.log('save user coords reducer', action.payload);
      return {
        ...state,
        lngLat : [...action.payload]
      };

    case types.FILL_COMMENT:
      return {
        ...state,
        userComment : action.payload
      };
  

    default:
      return state;
  }

  
}


export default userReducer;