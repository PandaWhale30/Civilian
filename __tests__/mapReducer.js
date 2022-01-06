import subject from '../client/reducers/mapReducer';

describe('User Reducer', () => {
  let state;

  beforeEach(() => {
    state ={
      pinLocations: [],
      allIncidents: [{
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
    };

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
  
    describe('GET_COORDINATES', () => {
      const action = {
        type: 'GET_COORDINATES',
        payload: {
          "latitude": -23, 
          "longitude": 74, 
          "address": "33-24 Junction Blvd"
        }
      };
  
      it('should add new pins to pinLocations', () => {
        const { pinLocations } = subject(state, action);
        expect(pinLocations[0]).toEqual(true);
      });

      it('includes pinLocations not equal to original', () => {
        const { pinLocations } = subject(state, action);
        expect(pinLocations).not.toEqual(state.pinLocations);
      });
  
      it('returns a state object not strictly equal to the original', () => {
        const newState = subject(state, action);
        expect(newState).not.toEqual(state);
      });
    });
  });

  describe('POST_EVENT', () => {
    const action = {
      type: 'POST_EVENT',
      payload: true,
    };

    it('should change expandedPost to true when user clicks post', () => {
      const { expandedPost } = subject(state, action);
      expect(expandedPost).toEqual(true);
    });

    it('returns a state object not strictly equal to the original', () => {
      const newState = subject(state, action);
      expect(newState).not.toEqual(state);
    });
  });
});