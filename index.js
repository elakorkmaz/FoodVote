const express = require('express'),
      displayRoutes = require('express-routemap'),
      morgan = require('morgan'),
      pug = require('pug'),
      Sequelize = require('sequelize');

var db = require('./models');

var app = express(),
    sequelize = new Sequelize('foodvote', process.env.POSTGRES_USER, process.env.POSTGRES_PASSWORD, { dialect: 'postgres' });

app.use(express.static('public'));

app.set('view engine', 'pug');

app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/:slug', (req, res) => {
  db.Meal.findOne({
    where: {
      slug: req.params.slug
    }
  }).then((Meal) => {
    res.render('/show', { meal: meal });
  }).catch((error) => {
    res.status(404).end();
  });
});

sequelize.sync().then(() => {
  console.log('connected to database');
  app.listen(3000, () => {
    console.log('server is now running on port 3000');
    displayRoutes(app);
  });
});
