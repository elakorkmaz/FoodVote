var express = require('express'),
    db = require('../models'),
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

router.post('/admin/register', (req, res) => {
  db.User.create(req.body).then(() => {
    res.redirect('/admin/');
  }).catch((error) => {
    res.redirect('/admin/register');
  });
});

// login admin -----------------------------------------------------------------

// logout admin ----------------------------------------------------------------

// create new menu -------------------------------------------------------------

// edit menu -------------------------------------------------------------------

// delete menu -----------------------------------------------------------------

module.exports = router;
