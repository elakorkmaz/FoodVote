const express = require('express'),
      displayRoutes = require('express-routemap'),
      morgan = require('morgan'),
      pug = require('pug'),
      Sequelize = require('sequelize'),
      fs = require('fs'),
      bodyParser = require('body-parser');

var app = express(),
    sequelize = new Sequelize('foodvote', process.env.POSTGRES_USER, process.env.POSTGRES_PASSWORD, { dialect: 'postgres' });

var likeStore = JSON.parse(fs.readFileSync('likes.json'));

app.set('view engine', 'pug');

app.use(express.static('public'));

app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/show', (req, res) => {
  res.render('show');
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
