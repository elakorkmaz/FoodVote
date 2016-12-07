const express = require('express'),
      displayRoutes = require('express-routemap'),
      morgan = require('morgan'),
      session = require ('express-session'),
      bodyParser = require('body-parser'),
      pug = require('pug');

var db = require('./models');

var app = express();

const adminRoutes = require('./routes/admin'),
      authenticationRoutes = require('./routes/authentication');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));

app.set('view engine', 'pug');
app.use(morgan('dev'));
app.use(session({ secret: 'secret key'}));

app.use('/', authenticationRoutes);
app.use('/admin', adminRoutes);

app.get('/', (req, res) => {
  console.log(res.session);    /// hier we run the session log in
  res.render('index');
});

app.get('/:slug', (req, res) => {
  db.meal.findOne({
    where: {
      slug: req.params.slug
    }
  }).then((Meal) => {
    res.render('/menus/show', { meal: meal });
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
