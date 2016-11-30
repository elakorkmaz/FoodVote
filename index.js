const express = require('express'),
      displayRoutes = require('express-routemap'),
      morgan = require('morgan'),
      pug = require('pug'),
      methodOverride = require('method-override'),
      bodyParser = require('body-parser');

var db = require('./models');

var app = express();

app.set('view engine', 'pug');

app.use(express.static('public'));

app.use(morgan('dev'));

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
