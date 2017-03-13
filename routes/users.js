var express = require('express'),
    db = require('../models'),
    router = express.Router();

// var requireUser= (req, res, next) => {
//   if (req.path === '/') {
//     return next();
//   }
//
//   if (req.session.user) {
//     next();
//   } else {
//     res.redirect('/user');
//   }
// };
//
// router.use(requireUser);

// landing page user ----------------------------------------------------------

router.get('/', (req, res) => {
  db.Menu.findAll().then((menus) => {
    res.render('users/index', { menus: menus, user: req.session.user });
    }).catch((error) => {
      res.status(404).end();
  });
});

// posting a vote --------------------------------------------------------------

router.post('/menus/:id/votes', (req, res) => {
  db.Menu.findById(req.params.id).then((menu) => {
    var userMenu = req.body;
    userMenu.MenuId = menu.id;
  }).catch((error) => {
      console.log('error occured');
      console.log(error);
      res.render('users/index', { errors: error.errors });
  });

  db.User.findById(req.session.user.id).then((user) => {
    var userMenu = req.body;
    userMenu.UserId = user.id;

    db.UserMenu.create(userMenu).then(() => {
        res.redirect('/users');
      });
  });
});

// log out ---------------------------------------------------------------------

router.get('/logout', (req, res) => {
  req.session.user = undefined;
  res.redirect('/');
});

// delete account --------------------------------------------------------------

router.delete('/:id', (req, res) => {
  db.User.destroy({
    where: {
      id: req.body.id
    }
  }).then(() => {
    res.redirect('/');
  });
});

// -------------------------------------------------------------------------- //

module.exports = router;
