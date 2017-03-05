const express = require('express'),
      displayRoutes = require('express-routemap'),
      morgan = require('morgan'),
      compression = require('compression'),
      pug = require('pug'),
      methodOverride = require('method-override'),
      bodyParser = require('body-parser'),
      session = require('express-session'),
      redis = require('redis'),
      redisStore = require('connect-redis')(session);

var port = process.env.PORT || 3000;

var db = require('./models'),
    assets = require('./config/assets');

var app = express();

const adminRoutes = require('./routes/admin'),
      userRoutes = require('./routes/user'),
      authenticationRoutes = require('./routes/authentication');

var client = redis.createClient();

var pg = require('pg');

pg.defaults.ssl = true;
pg.connect(process.env.DATABASE_URL, function(err, client) {
  if (err) throw err;
  console.log('Connected to postgres! Getting schemas...');

  client
    .query('SELECT table_schema,table_name FROM information_schema.tables;')
    .on('row', function(row) {
      console.log(JSON.stringify(row));
    });
});

app.set('view engine', 'pug');

app.use(compression());

app.use(morgan('dev'));

app.use(express.static('public', { maxAge: '1y' }));

client.on('connect', function() {
    console.log('connected');
});

app.use(bodyParser.urlencoded({ extended: false }));

app.use(methodOverride((req, res) => {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    var method = req.body._method;
    delete req.body._method;
    return method;
  }})
);

app.use(session({
    cookieName: 'cookie',
    secret: 'blabla',
    // create new redis store.
    store: new redisStore({ host: 'localhost', port: 6379, client: client, ttl :  260}),
    saveUninitialized: false,
    resave: false
}));

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
