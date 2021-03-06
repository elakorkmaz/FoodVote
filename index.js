const express = require('express'),
      displayRoutes = require('express-routemap'),
      morgan = require('morgan'),
      compression = require('compression'),
      pug = require('pug'),
      methodOverride = require('method-override'),
      bodyParser = require('body-parser'),
      session = require('express-session');

var port = process.env.PORT || 3000;

var db = require('./models'),
    assets = require('./config/assets');

var app = express();

const userRoutes = require('./routes/users'),
      authenticationRoutes = require('./routes/authentication');

app.set('view engine', 'pug');

// var pg = require('pg');
//
// var conString = process.env.DATABASE_URL;
//
// var client = new pg.Client(conString);
// client.connect();

// pg.defaults.ssl = true;
// pg.connect(process.env.DATABASE_URL, function(err, client) {
//   if (err) throw err;
//   console.log('Connected to postgres! Getting schemas...');
//
//   client
//     .query('SELECT table_schema,table_name FROM information_schema.tables;')
//     .on('row', function(row) {
//       console.log(JSON.stringify(row));
//     });
// });

app.use(morgan('dev'));

app.use(bodyParser.urlencoded({ extended: false }));

app.use(session({ secret: 'bla' }));

app.use(methodOverride((req, res) => {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    var method = req.body._method;
    delete req.body._method;
    return method;
  }})
);

app.use(compression());

app.use(express.static('public', { maxAge: '1y' }));

app.use('/users', userRoutes);
app.use('/authentication', authenticationRoutes);

app.locals.assets = assets;

// landing page general --------------------------------------------------------

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/menus/new', (req, res) => {
  res.render('menus/new');
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
