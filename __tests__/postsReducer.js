import subject from '../client/reducers/postsReducer';

describe('Posts Reducer', () => {
  let state;

  beforeEach(() => {
    state ={
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

  describe('SET_EXPANDED_POST', () => {
    const action = {
      type: 'SET_EXPANDED_POST',
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

  describe('CHANGE_ACTIVE_POST', () => {

    let action = {
      type: 'CHANGE_ACTIVE_POST',
      payload: '5',
      allIncidents: []
    };
    
    it('should not change state when incident_id is not found in allIncidents', () => {
      const newState = subject(state, action = {
        type: 'CHANGE_ACTIVE_POST',
        payload: '5',
        allIncidents: []
      });
      expect(newState).toEqual(state);
    });

    it('should change state when incident_id is found in allIncidents', () => {
      const newState = subject(state, action = {
        type: 'CHANGE_ACTIVE_POST',
        payload: '5',
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
      });
      expect(newState).not.toEqual(state);
    });

    it('should change title to the incident title', () => {
      const { title } = subject(state, action = {
        type: 'CHANGE_ACTIVE_POST',
        payload: '5',
        allIncidents: [{
          title: "Burger robber at Mcdonald's!",
          incident_id: "5",
        }]
      });
      expect(title).toBe("Burger robber at Mcdonald's!");
    });

    it('should change street_name to the incident street_name', () => {
      const { street_name } = subject(state, action = {
        type: 'CHANGE_ACTIVE_POST',
        payload: '5',
        allIncidents: [{
          street_name: "163 Branham Ln, San Jose, CA 95136",
          incident_id: "5",
        }]
      });
      expect(street_name).toBe("163 Branham Ln, San Jose, CA 95136");
    });

    it('should change details to the incident details', () => {
      const { details } = subject(state, action = {
        type: 'CHANGE_ACTIVE_POST',
        payload: '5',
        allIncidents: [{
          details: "something is afoul",
          incident_id: "5",
        }]
      });
      expect(details).toBe("something is afoul");
    });

    it('should change time to the incident time', () => {
      const { time } = subject(state, action = {
        type: 'CHANGE_ACTIVE_POST',
        payload: '5',
        allIncidents: [{
          time: "1/3/2022, 8:57:30 AM",
          incident_id: "5",
        }]
      });
      expect(time).toBe("1/3/2022, 8:57:30 AM");
    });

    it('should change image_url to the incident image_url', () => {
      const { image_url } = subject(state, action = {
        type: 'CHANGE_ACTIVE_POST',
        payload: '5',
        allIncidents: [{
          image_url: "www.png",
          incident_id: "5",
        }]
      });
      expect(image_url).toBe("www.png");
    });

    it('should change video_url to the incident video_url', () => {
      const { video_url } = subject(state, action = {
        type: 'CHANGE_ACTIVE_POST',
        payload: '5',
        allIncidents: [{
          video_url: "x.mp4",
          incident_id: "5",
        }]
      });
      expect(video_url).toBe("x.mp4");
    });

    it('should change incident_id to the incident incident_id', () => {
      const { incident_id } = subject(state, action = {
        type: 'CHANGE_ACTIVE_POST',
        payload: '5',
        allIncidents: [{
          video_url: "x.mp4",
          incident_id: "5",
        }]
      });
      expect(incident_id).toBe("5");
    });

    it('returns a state object not strictly equal to the original', () => {
      const newState = subject(state, action);
      expect(newState).not.toEqual(state);
    });
  
  });

  describe('GET_COMMENTS', () => {
    const action = {
      type: 'GET_COMMENTS',
      payload: [{
        comment: "bing bong",
        comment_id: 1,
        created_on: "1/3/2022, 8:56:41 AM",
        name: "Huy Bui",
        photo: 'photo.png'
      }]
    };

    it('should change comments array with new comments', () => {
      const { comments } = subject(state, action);
      expect(comments[0]).toEqual({
        comment: "bing bong",
        comment_id: 1,
        created_on: "1/3/2022, 8:56:41 AM",
        name: "Huy Bui",
        photo: 'photo.png'
      });
    });

    it('includes comments not equal to original', () => {
      const { comments } = subject(state, action);
      expect(comments).not.toEqual(state.comments);
    });

    it('returns a state object not strictly equal to the original', () => {
      const newState = subject(state, action);
      expect(newState).not.toEqual(state);
    });
  });

  describe('POST_COMMENT', () => {
    const action = {
      type: 'POST_COMMENT',
      payload: [{
        comment: "bing bong",
        comment_id: 1,
        created_on: "1/3/2022, 8:56:41 AM",
        name: "Huy Bui",
        photo: 'photo.png'
      }]
    };

    it('should change comments array with new comments', () => {
      const { comments } = subject(state, action);
      expect(comments[0]).toEqual([{
        comment: "bing bong",
        comment_id: 1,
        created_on: "1/3/2022, 8:56:41 AM",
        name: "Huy Bui",
        photo: 'photo.png'
      }]);
    });

    it('includes comments not equal to original', () => {
      const { comments } = subject(state, action);
      expect(comments).not.toEqual(state.comments);
    });

    it('returns a state object not strictly equal to the original', () => {
      const newState = subject(state, action);
      expect(newState).not.toEqual(state);
    });
  });

})