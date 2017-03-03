const express = require('express'),
      displayRoutes = require('express-routemap'),
      morgan = require('morgan'),
      compression = require('compression'),
      pug = require('pug'),
      methodOverride = require('method-override'),
      bodyParser = require('body-parser'),
      session = require('express-session'),
      bcrypt = require('bcrypt');

var port = process.env.PORT || 3000;

var db = require('./models'),
    assets = require('./../config/assets');

var app = express();

const adminRoutes = require('./routes/admin'),
      userRoutes = require('./routes/user'),
      authenticationRoutes = require('./routes/authentication');

app.set('view engine', 'pug');

app.use(compression());

app.use(express.static('public', { maxAge: '1y' }));

app.use(session({
  name: 'session-cookie',
  secret: 'our secret key',
  resave: true,
  saveUninitialized: true
}));

app.use(morgan('dev'));

app.use(bodyParser.urlencoded({ extended: false }));

app.use(methodOverride((req, res) => {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    var method = req.body._method;
    delete req.body._method;
    return method;
  }})
);

app.use('/admin', adminRoutes);
app.use('/user', userRoutes);
app.use('/authentication', authenticationRoutes);

app.locals.assets = assets;

// landing page general --------------------------------------------------------

app.get('/', (req, res) => {
  res.render('index');
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

// starting server ---------------------------------------------------------- //

db.sequelize.sync().then(() => {
  app.listen(port, () => {
    console.log('server is now running on port ' + port);
    displayRoutes(app);
  });
});
