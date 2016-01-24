var models = require('../models');
var express = require('express');
var router = express.Router();

router.get('/status', function(req, res, next) {
  res.render('status', { status: 'Server is currently eating shit.' });
});

router.get('/servers', function (req, res, next) {
    models.Server.findAll({
    
    }).then(function(servers) {
        res.json(servers);
    });
});

router.post('/servers/update', function (req, res, next) {
    console.log(req.body);
    res.json(req.body.hostname);    
});

module.exports = router;
