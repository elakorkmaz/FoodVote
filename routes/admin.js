var express = require('express'),
    db = require('../models'),
    bcrypt = require('bcrypt'),
    router = express.Router();

// admin landing page ----------------------------------------------------------

router.get('/', (req, res) => {
  db.Menu.findAll({ order: [['createdAt', 'DESC']] }).then((menus) => {
    res.render('admin/index', { menus: menus });
  }).catch((error) => {
    throw error;
  });
});

// register admin --------------------------------------------------------------

router.get('/register', (req, res) => {
  res.render('admin/new');
});

router.post('/register', (req, res) => {
  db.User.create({
      name: req.body.name,
      surname: req.body.surname,
      email: req.body.email,
      password: req.body.password,
      admin: true
  }).then((user) => {
    res.redirect('/admin');
  }).catch((error) => {
    res.redirect('/admin/register');
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
    bcrypt.compare(req.body.password, userInDB.password, (error, result) => {
      if (result) {
        req.session.user = userInDB;
        res.redirect('/');
      } else {
        res.redirect('/admin/login');
      }
    });
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
  res.render('menus/new');
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
  res.render('menus/edit', { menu: menu });
  });
});

router.post('/menus/:id', (req, res) => {
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
