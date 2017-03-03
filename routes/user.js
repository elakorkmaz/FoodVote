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
    res.render('user/index', { menus: menus });
    }).catch((error) => {
      res.status(404).end();
  });
});

// posting a vote --------------------------------------------------------------

router.post('/menus/:id/votes', (req, res) => {
  db.Menu.findById(req.params.id).then((menu) => {
    var userMenu = req.body;
    userMenu.MenuId = menu.id;
  });

  db.User.findById(req.session.user.id).then((user) => {
    var userMenu = req.body;
    userMenu.UserId = user.id;

    db.UserMenu.create(userMenu).then(() => {
        res.redirect('/user');
      });
  });
});

// log out ---------------------------------------------------------------------

router.get('/logout', (req, res) => {
  req.session.user = undefined;
  res.redirect('/');
});

// -------------------------------------------------------------------------- //

module.exports = router;
