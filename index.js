const express = require('express'),
      displayRoutes = require('express-routemap'),
      morgan = require('morgan'),
      session = require ('express-session'),
      bodyParser = require('body-parser'),
      pug = require('pug');
      methodOverride = require('method-override');

var db = require('./models');

var app = express();

const adminRoutes = require('./routes/admin'),
      authenticationRoutes = require('./routes/authentication');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));

app.set('view engine', 'pug');

app.use(express.static('public'));

app.use(morgan('dev'));
app.use(session({ secret: 'secret key'}));

app.use('/', authenticationRoutes);
app.use('/admin', adminRoutes);

app.use(bodyParser.urlencoded({ extended: false }));

app.use(methodOverride((req, res) => {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    var method = req.body._method;
    delete req.body._method;
    return method;
  }})
);

app.get('/', (req, res) => {
  db.Menu.findAll().then((menus) => {
    res.render('index', { menus: menus });
  }).catch((error) => {
    res.status(404).end();
  });
});

app.get('/:slug', (req, res) => {
  db.meal.findOne({
    where: {
      slug: req.params.slug
    }
  }).then((Meal) => {
    res.render('/menus/show', { meal: meal });
  });
});

app.get('/menus/:slug', (req, res) => {
  db.Menu.findOne({
    where: {
      slug: req.params.slug
    }
  }).then((menu) => {
    res.render('menus/show', { menu: menu });
  }).catch((error) => {
    res.status(404).end();
  });
});

db.sequelize.sync().then(() => {
  console.log('connected to database');
  app.listen(3000, () => {
    console.log('server is now running on port 3000');
    displayRoutes(app);
  });
});
