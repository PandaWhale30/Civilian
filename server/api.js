const express = require('express');

const controller = require('./controller');

const router = express.Router();
const cors = require('cors');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oidc')

//this where is the problem is 
const passportObj = require('./passport.setup.js');

passportObj.passportSetup();

// gets all rows from public.user table
router.get(
  '/users',
  controller.getUsers,
  (req, res) => res.status(200).json(res.locals.userInfo),
);

// gets all incidents from public.incident table
router.get(
  '/incidents',
  controller.getIncidents,
  (req, res) => res.status(200).json(res.locals.incidentInfo),
);

// gets name, photo from pulblic.user, passing username & decrypting password in req.body
router.post(
  '/incidents/user',
  controller.getUserName,
  (req, res) => res.status(200).json(res.locals.user),
);

// gets all incidents from public.incident by street name. Can target address, city,
// state, or zipcode
router.get(
  '/incidents/location/:name',
  controller.getIncidentByStreetName,
  (req, res) => res.status(200).json(res.locals.incidentByStreetName),
);

// posts data into a row in the public.incident table
router.post(
  '/postevent',
  controller.postEvent,
  (req, res) => res.status(201).json(res.locals.allEvents),
);

// posts name, encrypted password into a row in the public.user table
router.post(
  '/signup',
  controller.hash,
  controller.newUser,
  (req, res) => res.status(201).json(res.locals.newUser),
);

// all these update public.incident by its relevant column.
// :Id should match primary key of public.incident.incident_id
router.put(
  '/incidents/update-title:id',
  controller.updateIncidentTitle,
  (req, res) => res.status(200).json('Title was updated!'),
);

router.put(
  '/incidents/update-streetname:id',
  controller.updateIncidentStreetName,
  (req, res) => res.status(200).json('streetname was updated!'),
);

router.put(
  '/incidents/update-video:id',
  controller.updateIncidentVideo,
  (req, res) => res.status(200).json('video was updated!'),
);

router.put(
  '/incidents/update-image:id',
  controller.updateIncidentImage,
  (req, res) => res.status(200).json('image was updated!'),
);

router.put(
  '/incidents/update-details:id',
  controller.updateIncidentDetails,
  (req, res) => res.status(200).json('details was updated!'),
);

//this is endpoint that routes oauth authentication 
router.get(
  '/auth/google', cors({
    origin: '*',
    methods: "GET, POST, PATCH, DELETE, PUT",
    allowedHeaders: "Content-Type, Authorization",

}), passport.authenticate('google', { scope: ['openid', 'profile', 'email'] }),
  (req,res) => {
    console.log('passed passport.authenticate')
    res.status(200).send('recieved response from google')}
);

router.get(
  '/auth/google/callback', () => {console.log("entered callback route")}, passport.authenticate('google'), 
  (req, res) => {
    res.status(200).send('logged in')
    //this is when to send to frontend 
    //store the user data into the passport session data
    // to do// --> change this to fit what we're passing into redux in frontend 
    req.session.userID = req.session.passport.user;
    console.log(req.session.passport.user);

    //redirect to home page? // --> how would we redirect while simultaneously maintining state 
    res.status(200).redirect('/');
  }
);

module.exports = router;