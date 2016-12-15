const express = require('express'),
      displayRoutes = require('express-routemap'),
      morgan = require('morgan'),
      compression = require('compression'),
      pug = require('pug'),
      methodOverride = require('method-override'),
      bodyParser = require('body-parser'),
      session = require('express-session');

const userRouter = require('./routes/user');

var db = require('./models'),
    assets = require('./config/assets');

var app = express();

const adminRoutes = require('./routes/admin'),
      authenticationRoutes = require('./routes/authentication');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));

app.set('view engine', 'pug');

app.use(compression());

app.use(express.static('public', { maxAge: '1y' }));

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

app.use('/user', userRouter);

app.locals.assets = assets;

// landing page ------------------------------------------------------------- //

app.get('/', (req, res) => {
    db.Menu.findAll().then((menus) => {
      res.render('index', { menus: menus });
    }).catch((error) => {
      res.status(404).end();
    });
});

// app.get('/:slug', (req, res) => {
//   db.Meal.findOne({
//     where: {
//       slug: req.params.slug
//     }
//   }).then((Meal) => {
//     res.render('/menus/show', { meal: meal });
//   });
// });

app.get('/menus/:slug', (req, res) => {
  db.Menu.findOne({
    where: {
      slug: req.params.slug
    }
  }).then((menu) => {
    return db.Vote.findAndCountAll({
    })
    .then((result) => {
      res.render('menus/show', { menu: menu, result: result });
    });
  });
});

app.post('/menus/:id/votes', (req, res) => {
  db.Menu.findById(req.params.id).then((menu) => {
    var vote = req.body;
    vote.MenuId = menu.id;

    db.Vote.create(req.body).then(() => {
        res.redirect('/');
      }).catch((error) => {
        throw error;
      });
    });
});


db.sequelize.sync().then(() => {
  app.listen(3000, () => {
    console.log('server is now running on port 3000');
    displayRoutes(app);
  });
});
