import subject from '../client/reducers/userReducer';

describe('User Reducer', () => {
  let state;

  beforeEach(() => {
    state ={
      isLoggedIn: false,
      username: '',
      photo: '',
      lngLat: [],
      userComment: '',
      userID: null
    };
  });

  describe('default state', () => {
    it('should return a default state when given an undefined input', () => {
      expect(subject(undefined, { type: undefined })).toEqual(state);
    });
  });

  describe('unrecognized action types', () => {
    it('should return the original without any duplication', () => {
      const action = { type: 'loremipsum' };
      expect(subject(state, action)).toBe(state);
    });
  });

  describe('GET_USERNAME', () => {
    const action = {
      type: 'GET_USERNAME',
      payload: {name: 'Ruzeb', photo: 'www.com', user_id: 20},
    };

    it('changes isLoggedIn to true', () => {
      const { isLoggedIn } = subject(state, action);
      expect(isLoggedIn).toEqual(true);
    });

    it('changes username to the name property in the payload', () => {
      const { username } = subject(state, action);
      expect(username).toEqual('Ruzeb');
    });

    it('changes photo to action.payload.photo url', () => {
      const { photo } = subject(state, action);
      expect(photo).toEqual('www.com');
    });

    it('changes userID to be action.payload.user_id', () => {
      const { userID } = subject(state, action);
      expect(userID).toEqual(20);
    });

    it('returns a state object not strictly equal to the original', () => {
      const newState = subject(state, action);
      expect(newState).not.toEqual(state);
    });
  });

  describe('SAVE_USER_COORDS', () => {
    const action = {
      type: 'SAVE_USER_COORDS',
      payload: [40.300, -74.32432]
    };
    
    it('changes lngLat to the payload and lngLat is not equal to original', () => {
      const { lngLat } = subject(state, action);
      expect(lngLat[0]).toEqual(40.300);
      expect(lngLat[1]).toEqual(-74.32432);
    });
    
    it('includes lngLat not equal to original', () => {
      const { lngLat } = subject(state, action);
      expect(lngLat).not.toEqual(state.lngLat);
    });
    
    it('returns a state object not strictly equal to the original', () => {
      const newState = subject(state, action);
      expect(newState).not.toEqual(state);
    });

  
  });

  describe('FILL_COMMENT', () => {
    const action = {
      type: 'FILL_COMMENT',
      payload: 'brrr'
    };
    
    it('changes userComment field to payload', () => {
      const { userComment } = subject(state, action);
      expect(userComment).toBe('brrr')
    });

    it('returns a state object not strictly equal to the original', () => {
      const newState = subject(state, action);
      expect(newState).not.toBe(state);
    });
  
  });

})