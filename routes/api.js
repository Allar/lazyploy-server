var models = require('../models');
var router = require('feathers').Router();
var fs = require('fs-extra');
var mkdirp = require('mkdirp');
var multer  = require('multer');

var upload_dir = './uploads';
var storage_dir = './storage/';
var upload = multer({ dest: upload_dir });

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

router.get('/projects/:project_name/build/new/:desc', function (req, res, next) {
    FindProjectOrFail(req.params.project_name, res)
    .then(function(project) {
        models.Build.create({
            project: req.params.project_name,
            desc: req.params.desc,
            status: 'Started'
        }).then(function (build) {
            res.json({build});
        });
    });
});

router.post('/projects/:project_name/build/upload/:build_id', upload.any(), function (req, res, next) {
    FindProjectOrFail(req.params.project_name, res)
    .then(function(project) {
        var BuildDir = storage_dir + req.params.project_name + '/' + req.params.build_id + '/';
        mkdirp.sync(BuildDir);
        console.log(req.files);
        for (var i = 0; i < req.files.length; ++i) {
            console.log('Recieved ' + req.files[i].originalname + ' for project ' + req.params.project_name + ' build ' + req.params.build_id + '.');
            fs.move(req.files[i].destination + '/' + req.files[i].filename, BuildDir + req.files[i].originalname, { clobber: true }, function(err) {
                if (err) return console.error(err);
            });            
        }
        
        res.json({status: "Files uploaded."});
    });    
});

module.exports = router;
