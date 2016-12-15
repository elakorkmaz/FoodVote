
var express = require('express'),
    bcrypt = require('bcrypt'),
    db = require('../models'),
    router = express.Router();

// register a user ---------------------------------------------------------- //

router.get('/register', (req, res) => {
  if (req.session.user) {
    res.redirect('/');
  }
  res.render('users/new');
});

router.post('/register', (req, res) => {
  db.User.create(req.body).then((user) => {
    req.session.user = user;
    res.redirect('/');
  }).catch((error) => {
    console.log('error occured');
    console.log(error);
    res.render('users/new', { errors: error.errors });
  });
});

// login user --------------------------------------------------------------- //

router.get('/login', (req, res) => {
  res.render('index');
});

router.post('/login', (req, res) => {
  console.log(req.body);

  db.User.findOne({
    where: {
      email: req.body.email
    }
  }).then((userInDB) => {
    bcrypt.compare(req.body.password, userInDB.password, (error, result) => {
      if (result) {
        req.session.user = userInDB;
        res.redirect('/');
      } else {
        res.redirect('/user-authentication/login');
      }
    });
  }).catch((error) => {
    console.log('error occured');
    console.log(error);
    res.redirect('/authentication/login');
  });
});

// voting on a menu --------------------------------------------------------- //


// -------------------------------------------------------------------------- //

module.exports = router;
