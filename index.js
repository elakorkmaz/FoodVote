const express = require('express'),
      displayRoutes = require('express-routemap'),
      morgan = require('morgan'),
      pug = require('pug'),
      Sequelize = require('sequelize'),
      fs = require('fs'),
      bodyParser = require('body-parser'),
      methodOverride = require('method-override');

var db = require('./models');

var app = express(),
    sequelize = new Sequelize('foodvote', process.env.POSTGRES_USER, process.env.POSTGRES_PASSWORD, { dialect: 'postgres' });

var likeStore = JSON.parse(fs.readFileSync('likes.json'));

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
  res.render('index');
});

app.get('/:slug', (req, res) => {
  db.Meal.findOne({
    where: {
      slug: req.params.slug
    }
  }).then((meal) => {
    res.render('/show', { meal: meal });
  });
});

app.post('/like', (req, res) => {
  likeStore.likeCount = likeStore.likeCount + 1;

  res.json(likeStore);

  fs.writeFile('likes.json', JSON.stringify({ likeCount: likeCount }), (error, data) => {
    if (error) {
      throw error;
    }
  });
});

sequelize.sync().then(() => {
  console.log('connected to database');
  app.listen(3000, () => {
    console.log('server is now running on port 3000');
    displayRoutes(app);
  });
});
