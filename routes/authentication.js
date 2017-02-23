var express = require('express'),
    bcrypt = require('bcrypt'),
    db = require('../models'),
    router = express.Router();

    // register as user ------------------------------------------------------------

    router.get('/register', (req, res) => {
      res.render('authentication/new');
    });

    router.post('/new', (req, res) => {
      db.User.create(req.body).then((user) => {
        req.session.user = user;
        res.redirect('/users');
      }).catch((error) => {
        console.log('error occured');
        console.log(error);
        res.render('authentication/new', { errors: error.errors });
      });
    });

    // login user --------------------------------------------------------------- //

    router.get('/login', (req, res) => {
      res.render('authentication/login');
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
            res.redirect('/users');
          } else {
            res.redirect('/authentication/login');
          }
        });
      }).catch((error) => {
        console.log('error occured');
        console.log(error);
        res.redirect('/authentication/login', { errors: error.errors });
      });
    });

module.exports = router;
