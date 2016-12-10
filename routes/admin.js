var express = require('express'),
    db = require('../models'),
    bcrypt = require('bcrypt'),
    router = express.Router();

// admin landing page ----------------------------------------------------------

router.get('/', (req, res) => {
  db.Menu.findAll().then((menus) => {
    res.render('admin/index', { menus: menus });
  });
});

// register admin --------------------------------------------------------------

router.get('/register', (req, res) => {
  res.render('admin/new');
});

router.post('/register', (req, res) => {
  db.User.create((req.body), {
    where: {
      admin: true
    }
  }).then(() => {
    res.redirect('/admin/');
  }).catch((error) => {
    res.redirect('/admin/register');
  });
});

// login admin -----------------------------------------------------------------

router.get('/login', (req, res) => {
  res.render('/admin/login');
});

router.post('/login', (req, res) => {
  console.log(req.body);

  db.User.findOne({
    where: {
      email: req.body.email,
      admin: true
    }
  }).then((userInDB) => {
    bcrypt.compare(req.body.password, userInDB.password, (error, result) => {
      if (result) {
        req.session.user = userInDB;
        res.redirect('/');
      } else {
        res.redirect('/admin/login');
      }
    });
  }).catch((error) => {
    console.log('error occured');
    console.log(error);
    res.redirect('/admin/login');
  });
});

// logout admin ----------------------------------------------------------------

router.get('/logout', (req, res) => {
  req.session.user = undefined;
  res.redirect('/');
});

// create new menu -------------------------------------------------------------

router.post('/new', (req, res) => {
  db.Menu.create(req.body).then((Menu) => {
    res.redirect('/' + menu.slug);
  });
});

// edit menu -------------------------------------------------------------------

router.put('/edit/:id', (req, res) => {
  db.Menu.update(req.body, {
    where: {
      id: req.params.id
    }
  }).then(() => {
    res.redirect('/admin/');
  });
});

// delete menu -----------------------------------------------------------------

router.delete('/menus/:id', (req, res) => {
  db.Menu.destroy({
    where: {
      id: req.params.id
    }
  }).then(() => {
    res.redirect('/admin/');
  });
});

// -----------------------------------------------------------------------------

module.exports = router;
