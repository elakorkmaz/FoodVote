const express = require('express'),
      displayRoutes = require('express-routemap'),
      morgan = require('morgan'),
      pug = require('pug'),
      Sequelize = require('sequelize');

var app = express(),
    sequelize = new Sequelize('foodvote', process.env.POSTGRES_USER, process.env.POSTGRES_PASSWORD, { dialect: 'postgres' });

var meal = sequelize.define('meal', {
      title: Sequelize.STRING,
      slug: Sequelize.STRING,
      content: Sequelize.TEXT,
      likes: Sequelize.INTEGER
    }),
    like = sequelize.define('like', {
      number: Sequelize.INTEGER,
      MealId: Sequelize.INTEGER
  });

app.use(express.static('public'));

app.set('view engine', 'pug');

app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/show', (req, res) => {
  res.render('show');
});

sequelize.sync().then(() => {
  console.log('connected to database');
  app.listen(3000, () => {
    console.log('server is now running on port 3000');
    displayRoutes(app);
  });
});
