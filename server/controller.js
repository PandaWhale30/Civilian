const db = require('./database');
const bcrypt = require('bcrypt');

const controller = {};

// hash a user inputted password
controller.hash = async (req, res, next) => {
  try {
    const { name, password } = req.body;
    const hashedPw = await bcrypt.hash(password, 10, (err, hash) => {
      const userSignup = { name: name, hashedPw: hash };
      res.locals.signupInfo = userSignup;
      return next();
    });
  } catch (error) {
    return next({
      log: `controller.hash ERROR found`,
      status: 500,
      message: {
        err: 'Error occurred in controller.hash. Check the server logs.',
      },
    });
  }
};

// get all users
controller.getUsers = async (req, res, next) => {
  try {
    // SQL command string
    const queryString = `SELECT * from public.user`;

    // db query function to get info from our database
    const result = await db.query(queryString);

    // db.query will return a giant nested object. We just need the data in the rows key
    const data = result.rows;

    // store data in res.locals.all to pass to api router
    res.locals.userInfo = data;
    return next();
  } catch (error) {
    return next({
      log: `getUsers controller ERROR`,
      message: {
        err: 'Error occurred in controller.getUsers. Check the server logs.',
      },
    });
  }
};

// get all incidents in public.incident
controller.getIncidents = async (req, res, next) => {
  try {
    // SQL command string
    const queryString = `SELECT * from public.incident`;

    // db query function to get info from our database
    const result = await db.query(queryString);

    // db.query will return a giant nested object. We just need the data in the rows key
    const data = result.rows;

    // store data in res.locals.all to pass to api router
    res.locals.incidentInfo = data;
    return next();
  } catch (error) {
    return next({
      log: `getIncident controller ERROR`,
      message: {
        err: 'Error occurred in controller.getIncidents. Check the server logs.',
      },
    });
  }
};

controller.getCommentsByIncident = async (req, res, next) => {
  
  try {

    console.log(req.params);
    // destructure incident id from parameters of incoming request
    const { incident_id } = req.params;

    // SQL command string to get the comments on a given incident
    const queryString = `SELECT comment_id, comment, created_on, name, photo from COMMENTS JOIN public.user ON public.user.user_id = comments.user_id WHERE incident_id = $1`;

    // db query function to get info from our database
    const result = await db.query(queryString, [incident_id]);

    // db.query will return a giant nested object. We just need the data in the rows key
    const data = result.rows;

    // store data in res.locals.all to pass to api router
    res.locals.comments = data;
    return next();
  } catch (error) {
    return next({
      log: `getCommentsbyIncident controller ERROR ${error}`,
      message: {
        err: 'Error occurred in controller.getCommentsbyIncident. Check the server logs.',
      },
    });
  }
};

// get name, and photo of a user. Requires name and password
controller.getUserName = async (req, res, next) => {
  console.log('USERNAME req body', req.body);
  try {
    const { name, password } = req.body;
    // SQL command string
    const queryString = `SELECT name, password, photo, user_id from public.user WHERE name = $1`;

    // db query function to get info from our database
    const result = await db.query(queryString, [name]);

    // store result in data variable
    const data = result.rows;
    const hash = data[0].password;

    // bcrypt comparison check
    await bcrypt.compare(password, hash, (err, ok) => {
      if (ok) {
        console.log('bcrypt comparison check OK');
        res.locals.user = {
          name: data[0].name,
          photo: data[0].photo,
          user_id: data[0].user_id
        };
        return next();
      } else {
        console.log('err')
        return next({
          log: `getUserName controller ${err}`,
          message: {
            err: 'Error occurred in controller.getIncidentByUserName. Check the server logs.',
          },
        });
      }
    });
  } catch (error) {
    return next({
      log: `getUserName controller ERROR`,
      message: {
        err: 'Error occurred in controller.getIncidentByUserName. Check the server logs.',
      },
    });
  }
};

// query incidents in public.incident by any value matching any part of public.incident.street_name
controller.getIncidentByStreetName = async (req, res, next) => {
  console.log(req.params);
  console.log(new Date(Date.now()).toString());
  try {
    const { name } = req.params;
    // SQL command string
    const queryString = `SELECT * from public.incident WHERE street_name LIKE '%'|| $1 || '%'`;

    // db query function to get info from our database
    const result = await db.query(queryString, [name]);

    // db.query will return a giant nested object. We just need the data in the rows key
    const data = result.rows;

    // store data in res.locals.all to pass to api router
    res.locals.incidentByStreetName = data;
    return next();
  } catch (error) {
    return next({
      log: `getIncidentByStreetName controller ERROR`,
      message: {
        err: 'Error occurred in controller.getIncidentByStreetName. Check the server logs.',
      },
    });
  }
};

// post incident into public.incident. Req(title, street_name, video_url, image_url, details) but values can be null!
controller.postEvent = async (req, res, next) => {
  console.log(req.body);
  try {
    // capture the current date and time to insert into sql db
    const time = new Date(Date.now()).toLocaleString();

    // object destructuring the req.body to pass in to params
    const { title, street_name, video_url, image_url, details } = req.body;
    const params = [
      // params will be passed to db query, to insert the data object to the sql db
      title,
      street_name,
      video_url,
      image_url,
      details,
      time,
    ];

    // SQL command to insert values into the following table(public.incident) columns
    const text = `
      INSERT INTO public.incident (title, street_name, video_url, image_url, details, time)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
      `;

    // our async function passing in the SQL command string 'text' and our params data
    const result = await db.query(text, params);

    // store the evaluated query result into res.locals.allEvents to pass to api router
    res.locals.allEvents = result.rows[0];
    return next();
  } catch (error) {
    return next({
      log: `controller.postEvent ERROR found`,
      status: 500,
      message: {
        err: 'Error occurred in controller.postEvent. Check the server logs.',
      },
    });
  }
};

controller.postCommentOnIncident = async (req, res, next) => {
  console.log(req.body);
  try{
    const time = new Date(Date.now()).toLocaleString();

    // object destructuring the req.body to pass in to params
    const { incident_id, user_id, comment } = req.body;
    
    // params will be passed to db query, to insert the data object to the sql db
    const params = [
      incident_id,
      user_id,
      comment,
      time
    ];

    // SQL command to insert values into the following table(public.incident) columns
    const text = `WITH inserted_comment AS(
      INSERT INTO public.comments (incident_id, user_id, comment, created_on)
      VALUES ($1, $2, $3, $4)
      RETURNING *)
      SELECT * FROM inserted_comment
      JOIN public.user ON public.user.user_id = inserted_comment.user_id WHERE incident_id = $1
      `;

    // our async function passing in the SQL command string 'text' and our params data
    const result = await db.query(text, params);

    // store the evaluated query result into res.locals.allEvents to pass to api router
    res.locals.comment = result.rows[0];
    return next();
  } catch (error) {
    return next({
      log: `controller.postCommentOnIncident ERROR found ${error}`,
      status: 500,
      message: {
        err: 'Error occurred in controller.postCommentOnIncident. Check the server logs.',
      },
    });
  }
};


// create a new row in public.user, storing name and encrypted password
controller.newUser = async (req, res, next) => {
  console.log('signupInfo', res.locals.signupInfo);

  try {
    // object destructuring the req.body to pass in to params
    const { name, hashedPw } = res.locals.signupInfo;

    const params = [
      // params will be passed to db query, to insert the data object to the sql db
      name,
      hashedPw,
    ];

    // SQL command to insert values into the following table(public.user) columns
    const text = `
        INSERT INTO public.user (
          name,
          password)
        VALUES ($1, $2)
        RETURNING *
        `;

    // our async function passing in the SQL command string 'text' and our params data
    const result = await db.query(text, params);

    // store the evaluated query result into res.locals.newUser to pass to api router
    res.locals.newUser = result.rows[0];
    return next();
  } catch (error) {
    return next({
      log: `controller.newUser ERROR found`,
      status: 500,
      message: {
        err: 'Error occurred in controller.newUser. Check the server logs.',
      },
    });
  }
};

// updates fields in public.incident table by column name
controller.updateIncidentTitle = async (req, res, next) => {
  console.log('req.body', req.body);
  try {
    const { id } = req.params; // for sql WHERE
    const { title } = req.body; // for sql SET
    const text = `UPDATE public.incident SET title = $1 WHERE incident_id = $2`;

    await db.query(text, [title, id]);
    return next();
  } catch (error) {
    return next({
      log: `controller.updateIncidentTitle ERROR found`,
      status: 500,
      message: {
        err: 'Error occurred in controller.updateIncidentTitle. Check the server logs.',
      },
    });
  }
};

controller.updateIncidentStreetName = async (req, res, next) => {
  console.log('req.body', req.body);
  try {
    const { id } = req.params; // for sql WHERE
    const { streetname } = req.body; // for sql SET
    const text = `UPDATE public.incident SET street_name = $1 WHERE incident_id = $2`;

    await db.query(text, [streetname, id]);
    return next();
  } catch (error) {
    return next({
      log: `controller.updateIncidentStreetName ERROR found`,
      status: 500,
      message: {
        err: 'Error occurred in controller.updateIncidentStreetName. Check the server logs.',
      },
    });
  }
};

controller.updateIncidentVideo = async (req, res, next) => {
  console.log('req.body', req.body);
  try {
    const { id } = req.params; // for sql WHERE
    const { videoUrl } = req.body; // for sql SET
    const text = `UPDATE public.incident SET video_url = $1 WHERE incident_id = $2`;

    await db.query(text, [videoUrl, id]);
    return next();
  } catch (error) {
    return next({
      log: `controller.updateIncidentVideo ERROR found`,
      status: 500,
      message: {
        err: 'Error occurred in controller.updateIncidentVideo. Check the server logs.',
      },
    });
  }
};

controller.updateIncidentImage = async (req, res, next) => {
  console.log('req.body', req.body);
  try {
    const { id } = req.params; // for sql WHERE
    const { imageUrl } = req.body; // for sql SET
    const text = `UPDATE public.incident SET image_url = $1 WHERE incident_id = $2`;

    await db.query(text, [imageUrl, id]);
    return next();
  } catch (error) {
    return next({
      log: `controller.updateIncidentImage ERROR found`,
      status: 500,
      message: {
        err: 'Error occurred in controller.updateIncidentImage. Check the server logs.',
      },
    });
  }
};

controller.updateIncidentDetails = async (req, res, next) => {
  console.log('req.body', req.body);
  try {
    const { id } = req.params; // for sql WHERE
    const { details } = req.body; // for sql SET
    const text = `UPDATE public.incident SET details = $1 WHERE incident_id = $2`;

    await db.query(text, [details, id]);
    return next();
  } catch (error) {
    return next({
      log: `controller.updateIncidentDetails ERROR found`,
      status: 500,
      message: {
        err: 'Error occurred in controller.updateIncidentDetails. Check the server logs.',
      },
    });
  }
};

module.exports = controller;
