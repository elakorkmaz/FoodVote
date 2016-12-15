var express = require('express'),
    db = require('../models'),
    bcrypt = require('bcrypt'),
    router = express.Router();

// admin landing page ----------------------------------------------------------

router.get('/', (req, res) => {
  db.Menu.findAll({ order: [['createdAt', 'DESC']] }).then((menus) => {
    res.render('admin/index', { menus: menus, user: req.session.user });
  }).catch((error) => {
    throw error;
  });
});

// login admin -----------------------------------------------------------------

router.get('/login', (req, res) => {
  res.render('admin/login');
});

router.post('/login', (req, res) => {
  console.log(req.body);

  db.User.findOne({
    where: {
      email: req.body.email,
      admin: true
    }
  }).then((userInDB) => {
        req.session.user = userInDB;
        res.redirect('/admin');
  }).catch((error) => {
    res.redirect('/admin/login');
  });
});

// logout admin ----------------------------------------------------------------

router.get('/logout', (req, res) => {
  req.session.user = undefined;
  res.redirect('/');
});

// create new menu -------------------------------------------------------------

router.get('/menus/new', (req, res) => {
  res.render('menus/new', { user: req.session.user });
});

router.post('/menus/new', (req, res) => {
  db.Menu.create(req.body).then((menu) => {
    res.redirect('/menus/' + menu.slug);
  });
});

// edit menu -------------------------------------------------------------------

router.get('/menus/:id/edit', (req, res) => {
  db.Menu.findOne({
    where: {
      id: req.params.id
    }
  }).then((menu) => {
  res.render('menus/edit', { menu: menu, user: req.session.user });
  });
});

router.put('/menus/:id', (req, res) => {
  db.Menu.update(req.body, {
    where: {
      id: req.params.id
    }
  }).then(() => {
    res.redirect('/admin');
  });
});

// delete menu -----------------------------------------------------------------

router.delete('/menus/:id', (req, res) => {
  db.Menu.destroy({
    where: {
      id: req.params.id
    }
  }).then(() => {
    res.redirect('/admin');
  });
});

// -----------------------------------------------------------------------------

module.exports = router;
