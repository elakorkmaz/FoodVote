var express = require('express'),
    db = require('../models'),
    router = express.Router();


    var requireUser = (req, res, next) => {
  if (req.path === '/') {
    return next();
  }

  if (req.session.user) {
    next();
  } else {
    res.redirect('/admin');
  }
};

router.use(requireUser);

router.get('/', (req, res) => {
  if (req.session.user) {
    res.redirect('/admin/menus');
  }

  res.render('login');
});

router.get('/menus', (req, res) => {
  db.Post.findAll().then((blogPosts) => {
    res.render('posts/index', { menuPosts: menuPosts, user: req.session.user });
  }).catch((error) => {
    throw error;
  });
});

router.get('/menus/new', (req, res) => {
  res.render('posts/new', { user: req.session.user });
});

router.get('/menus/:id/edit', (req, res) => {
  db.Post.findOne({
    where: {
      id: req.params.id
    }
  }).then((post) => {
    res.render('menus/edit', { post: post, user: req.session.user });
  });
});

router.post('/menus', (req, res) => {
  db.Post.create(req.body).then((menu) => {
    res.redirect('/' + menu.slug);
  }).catch((error) => {
    console.log(error);
    res.render('menus/new', { errors: error.errors });
  });
});

router.put('/menus/:id', (req, res) => {
  db.Post.update(req.body, {
    where: {
      id: req.params.id
    }
  }).then(() => {
    res.redirect('/admin/menus');
  });
});

router.delete('/menus/:id', (req, res) => {
  db.Post.destroy({
    where: {
      id: req.params.id
    }
  }).then(() => {
    res.redirect('/admin/menus');
  });
});

module.exports = router;
