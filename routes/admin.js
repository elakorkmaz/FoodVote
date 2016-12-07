var express = require('express'),
    db = require('../models'),
    router = express.Router();

router.get('/', (req, res) => {
  db.Menu.findAll().then((menus) => {
    res.render('admin/index', { menus: menus });
  });
});

module.exports = router;
