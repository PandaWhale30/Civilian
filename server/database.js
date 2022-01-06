const { Pool } = require('pg');

const PG_URI = 'postgres://qvlqajje:HrMf5gGqZv9ROy972cYrtxDsbbQCAqN8@kashin.db.elephantsql.com/qvlqajje';
// old url 'postgres://vgrmebyf:S_1pEz4mslMJN_ie4x4YM8fnQOm2YdKv@kashin.db.elephantsql.com/vgrmebyf';

  const pool = new Pool({
    connectionString: PG_URI,
  });

  /* 
  the database has multiple tables:

  table public.incident:
    {
        "incident_id": 1, <-- PRIMARY KEY
        "title": "title here",
        "street_name": "street name, city, state zipcode",
        "video_url": "video url here"
        "image_url": "image url here"
        "details": "details here"
        "time": "1/2/2022, 10:11:08 PM",
        "user_id": 1, <-- FOREIGN KEY for public.user.user_id
        "location_id": 1 <-- FOREIGN KEY for public.location.location_id
    },

  table public.user:
    {
        "user_id": 1, <-- PRIMARY KEY
        "name": "Huy Bui",
        "email": "shuyttea@gmail.com",
        "photo": "https://avatars.githubusercontent.com/u/94398519?s=40&v=4",
        "password": "string here"
    },

  */  
  /* 
    table public.comments:
    {
        "comment_id": 1 <-- PRIMARY KEY
        "incident_id": 1 <-- FOREIGN KEY for public.incident.incident_id
        "user_id": 1, <-- FOREIGN KEY for public.user.user_id
        "comment": "bing bong",
        "created on": "1/2/2022, 10:11:08 PM"
    },
  */ 

  module.exports = {
    query: (text, params, callback) => {
      console.log('executed query', text);
      return pool.query(text, params, callback);
    }
  };