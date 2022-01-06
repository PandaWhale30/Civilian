const express = require('express');

const controller = require('./controller');

const router = express.Router();

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

// gets name, photo from pulblic.user, passing username &  decrypting password in req.body
router.post(
  '/incidents/user',
  controller.getUserName,
  (req, res) => res.status(200).json(res.locals.user),
);

// gets all comments from the incident id passed in as a param on the url
router.get(
  '/incidents/comments/:incident_id',
  controller.getCommentsByIncident,
  (req, res) => res.status(200).json(res.locals.comments),
);

// post new comment on a given incident id into comments table
router.post(
  '/incidents/comments/',
  controller.postCommentOnIncident,
  (req, res) => res.status(200).json(res.locals.comment),
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

module.exports = router;
