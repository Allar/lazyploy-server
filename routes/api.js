var models = require('../models');
var express = require('express');
var router = express.Router();
var fs = require('fs');
var mkdirp = require('mkdirp');
var multer  = require('multer');
var upload = multer({ dest: './uploadtest/' });

var storage_dir = './storage/';

router.get('/status', function(req, res, next) {
  res.render('status', { status: 'Server is currently eating shit.' });
});

router.get('/servers', function (req, res, next) {
    models.Server.findAll({
    
    }).then(function(servers) {
        res.json(servers);
    });
});

router.get('/projects', function (req, res, next) {
    models.Project.findAll({
    
    }).then(function(projects) {
        res.json(projects);
    });
});

function FindProjectOrFail(project_name, res)
{
    return new Promise(function(resolve, reject) {
        models.Project.find({ where: { name: project_name }})
        .then(function(project, err) {
            if (err) {
                console.error(err);
                res.status(500).json({status: 'Error: Can\'t find project because: ' + err});
                reject(err);
                return;
            }
            if (project == null) {
                res.status(404).json({status: "Error: Can't find project with name: " + project_name});
                reject("Can't find project with name: " + project_name);
                return;
            }
            resolve(project);
        });
    });
}

router.post('/projects/build/new', function (req, res, next) {
    var payload = req.body;
    var output = {};
    if (payload !== undefined) {
        if (payload.project == undefined) {
            res.stats(400).json({status: 'Error: Missing project name.'})
            return;
        }
        
        FindProjectOrFail(payload.project, res)
        .then(function(project) {
            models.Build.create({
                project: payload.project,
                desc: payload.desc,
                status: 'Started'
            }).then(function (build) {
                res.json({build});
            });
        });
    }
});

router.post('/uploadtest', upload.any(), function (req, res, next) {
    console.log(req.headers);
    res.json({status: 'OK'});
});

router.post('/projects/build/upload/:project_name/:build_id/:file_name', upload.any(), function (req, res, next) {
    FindProjectOrFail(req.params.project_name, res)
    .then(function(project) {
        console.log(req.files);
        res.json({status: 'File uploaded for project: ' + project.name});
    });    
});

router.post('/servers/update', function (req, res, next) {
    var payload = req.body;
    if (payload !== undefined) {
        if (payload.hostname !== undefined) {
            var serverIp = req.ip.substring(req.ip.lastIndexOf(':') + 1);
            models.Server.find({ where: { hostname: payload.hostname }})
            .then(function(server, err) {
                if (err) {
                    console.error(err);
                    res.status(500).json({status: 'ERROR: ' + err});
                    return;
                }
                if (!server) {
                    models.Server.create({
                        hostname: payload.hostname,
                        ip: serverIp,
                        status: payload.status
                    }).then(function(server) {
                       res.json({status: 'Server entry created.'}) ;
                    });
                } else {
                    server.updateAttributes({
                            hostname: payload.hostname,
                            ip: serverIp,
                            status: payload.status
                        }).then(function() {
                            res.json({status: 'Server entry updated.'}) ;
                        }).catch(function(e) {
                            res.json({status: 'Server entry update got fubar.'}) ;
                            
                    });
                }
            });            
        }
    }
    console.log(req.body);
});

module.exports = router;
