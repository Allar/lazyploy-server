const express = require('@feathersjs/express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Lazyploy' });
});

module.exports = router;
