const express = require('express'),
      displayRoutes = require('express-routemap'),
      morgan = require('morgan'),
      pug = require('pug'),
      Sequelize = require('sequelize');

var db = require('./models');

var app = express(),
    sequelize = new Sequelize('foodvote', process.env.POSTGRES_USER, process.env.POSTGRES_PASSWORD, { dialect: 'postgres' });

var Menu = sequelize.define('Menus', {
  title: Sequelize.STRING,
  slug: Sequelize.STRING,
  image: Sequelize.STRING,
  info: Sequelize.TEXT,
  votes: Sequelize.INTEGER
});

var Vote = sequelize.define('Votes', {
  number: Sequelize.INTEGER
});

app.use(express.static('public'));

app.set('view engine', 'pug');

app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/:slug', (req, res) => {
  db.Menu.findOne({
    where: {
      slug: req.params.slug
    }
  }).then((Menu) => {
    res.render('/show', { menu: menu });
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
