const express = require('express'),
      displayRoutes = require('express-routemap'),
      morgan = require('morgan'),
      compression = require('compression'),
      pug = require('pug'),
      methodOverride = require('method-override'),
      bodyParser = require('body-parser'),
      session = require('express-session');

var db = require('./models'),
    assets = require('./config/assets');

var app = express();

const adminRoutes = require('./routes/admin'),
      authenticationRoutes = require('./routes/authentication');

app.set('view engine', 'pug');

app.use(morgan('dev'));

app.use(bodyParser.urlencoded({ extended: false }));

app.use(session({ secret: 'secret key'}));

app.use(methodOverride((req, res) => {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    var method = req.body._method;
    delete req.body._method;
    return method;
  }})
);

app.use('/admin', adminRoutes);

app.use(compression());

app.use(express.static('public', { maxAge: '1y' }));

app.locals.assets = assets;

// landing page users ----------------------------------------------------------------

app.get('/users', (req, res) => {
  db.Menu.findAll().then((menus) => {
    res.render('users/index', { menus: menus, user: req.session.user });
    }).catch((error) => {
      res.status(404).end();
  });
});

// menu pages ------------------------------------------------------------------

app.get('/menus/:slug', (req, res) => {
  db.Menu.findOne({
    where: {
      slug: req.params.slug
    }
  }).then((menu) => {
    db.UserMenu.findAndCountAll({
      where: {
        MenuId: menu.id
      }
    }).then((voteCount) => {
      res.render('menus/show', { menu: menu, voteCount: voteCount, user: req.session.user });
    });
  });
});

// posting a vote --------------------------------------------------------------

app.post('/menus/:id/votes', (req, res) => {
  db.Menu.findById(req.params.id).then((menu) => {
    var userMenu = req.body;
    userMenu.MenuId = menu.id;
  });

  db.User.findById(req.session.user.id).then((user) => {
    var userMenu = req.body;
    userMenu.UserId = user.id;

    db.UserMenu.create(userMenu).then(() => {
        res.redirect('/users');
      });
    res.redirect('/users');
  });
});

// starting server ---------------------------------------------------------- //

db.sequelize.sync().then(() => {
  app.listen(3000, () => {
    console.log('server is now running on port 3000');
    displayRoutes(app);
  });
});
