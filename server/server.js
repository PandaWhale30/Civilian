const express = require('express');
const path = require('path');
const cors = require('cors');
const pool = require('./database');
const session = require('express-session')
const passport = require('passport');



const app = express();
const PORT = process.env.PORT || 3000;

const apiRouter = require('./api');
// const apiRouter = require('./routes/api');
// const whitelist = ["http://localhost:3000", "http://www.localhost:3000", "api.mapbox.com", "mapbox.com", "www.mapbox.com", "api.mapbox.com", "api.tiles.mapbox.com", "events.mapbox.com", "a.tiles.mapbox.com", "b.tiles.mapbox.com", "c.tiles.mapbox.com", "d.tiles.mapbox.com"];
//
// const corsOptions = {
//   credentials: true,
//   origin: (origin, callback) => {
//     if (whitelist.includes(origin) || !origin) {
//       return callback(null, true);
//     } else {
//       callback(new Error(`origin ${origin} not allowed by CORS`));
//     }
//   },
// };

// app.use(cors(corsOptions));
// Handels parsing request body

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
      origin: '*',
      methods: "GET, POST, PATCH, DELETE, PUT",
      allowedHeaders: "Content-Type, Authorization",
  
  })
  
);

// handle requests for static files
app.use(express.static('./client'));

const HTML_FILE = path.join(__dirname, '../client/index.html');

// route handler to respond with main app
app.get('/', (req, res) => {
  res
    .status(200)
    .contentType('text/html')
    .sendFile(HTML_FILE, (err) => {
      if (err) {
        res.status(500).send(err);
      }
    });
});

//we need to implement express sessions for google oauth support 
app.use(
  session({
    secret: 'blahblahblah',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 5000 },
  })
);

app.use(passport.initialize());
app.use(passport.session());


// defining route handlers

//this is endpoint that routes oauth authentication 
  //couldn't get it to work at the server.js level 

// app.get('/auth/google', (req, res) => {
//   console.log('server.js reached')
//   res.status(200).send('auth/google deployed')
// })

app.use('/api', apiRouter);



// global error handler
app.use((err, req, res, next) => {
  const defaultErr = {
    log: `Express error handler caught unknown middleware error ${err}`,
    status: 400,
    message: { err: 'An error occured' },
  };

  const errorObj = Object.assign({}, defaultErr, err);
  console.log(errorObj.log);

  const errorStatusCode = errorObj.status || 500;

  return res.status(errorStatusCode).json(errorObj.message);
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
});

module.exports = app;
