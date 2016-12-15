var express = require('express'),
    bcrypt = require('bcrypt'),
    db = require('../models'),
    crypto = require('crypto'),
    base64url = require('base64url'),
    nodemailer = require('nodemailer'),
    router = express.Router();

var transporter = nodemailer.createTransport(
  'smtps://marcoflaco%40gmail.com:' + process.env.PERSONAL_WEBSITE_EMAIL_PASSWORD + '@smtp.gmail.com'
);

var redirectIfUserLoggedIn = (req, res, next) => {
  if (req.session.user) {
    return res.redirect('/');
  }

  next();
};

router.get('/register', redirectIfUserLoggedIn, (req, res) => {
  if (req.session.user) {
    res.redirect('/');
  }

  res.render('register');
});

router.post('/register', redirectIfUserLoggedIn, (req, res) => {
  db.User.create(req.body).then((user) => {
    req.session.user = user;
    res.redirect('/');
  }).catch((error) => {
    res.render('users/new', { errors: error.errors });
  });
});
//////////////login part
router.get('/login', redirectIfUserLoggedIn, (req, res) => {
  res.render('login');
});

router.post('/login', redirectIfUserLoggedIn, (req, res) => {
  db.User.findOne({
    where: {
      email: req.body.email
    }
  }).then((userInDB) => {
    bcrypt.compare(req.body.password, userInDB.passwordDigest, (error, result) => {
      if (result) {
        req.session.user = userInDB;
        res.redirect('/');
      } else {
        res.render('login', { error: { message: 'Password is incorrect' } });
      }
    });
  }).catch((error) => {
    res.render('login', { error: { message: 'User not found in the database' } });
  });
});

router.get('/logout', (req, res) => {
  req.session.user = undefined;
  res.redirect('/');
});
/////////////////////////////////////////////////////////////
//forgot password
router.get('/forgotpassword', (req, res) => {
  res.render ('users/forgotpassword');
});

router.post('/forgotpassword', (req, res) =>{
  console.log(req.body);
  db.User.findOne({
    where: {
      email: req.body.email
    }
  }).then((user) => {

    if (user) {
      user.passwordResetToken = base64url(crypto.randomBytes(48));
      user.save().then((user) => {
        transporter.sendMail({
          to: user.email,
          subject: 'Menu application change password request',
          text: `
          Hi there,
          you have requested to change your password.
          You can change you password below:

          http://localhost:3000/change-password/${user.passwordResetToken}
          `
        }, (error, info) => {
          if (error) { throw error; }
          console.log('Password reset emails:');
          console.log(info);

        });
      });

      res.redirect('/');
    } else {
      res.redirect('/forgotpassword');
    }
  });
});

///////////////
module.exports = router;
