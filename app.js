var feathers = require('feathers');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var api = require('./routes/api');

var app = feathers();


app.configure(feathers.rest())
    .configure(feathers.socketio())
    .use(bodyParser.json())
    .use(bodyParser.urlencoded({ extended: false }))
    .use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
    .use(logger('dev'))
// jade rendering
    .set('views', path.join(__dirname, 'views'))
    .set('view engine', 'jade')
// static file serving
    .use('/static', feathers.static(path.join(__dirname, 'public')))
    .use('/static', feathers.static(path.join(__dirname, 'node_modules/bootstrap/dist')))
    .use('/static/js', feathers.static(path.join(__dirname, 'node_modules/angular')))
    .use('/static/js', feathers.static(path.join(__dirname, 'node_modules/angular-ui-bootstrap/dist')))
    .use('/uib', feathers.static(path.join(__dirname, 'node_modules/angular-ui-bootstrap')))
    .use('/static/js', feathers.static(path.join(__dirname, 'node_modules/angular-smart-table/dist')))
    .use('/static/css', feathers.static(path.join(__dirname, 'node_modules/ng-table/dist')))
    .use('/static/js', feathers.static(path.join(__dirname, 'node_modules/ng-table/dist')))
// routing
    .use('/', routes)
    .use('/api', api);

// Direct database access  
var sequelize = require('feathers-sequelize');
var models = require('./models');

app.use('/api/builds/', sequelize({ Model: models.Build }));
app.use('/api/projects/', sequelize({ Model: models.Project  }));
app.use('/api/servers/', sequelize({ Model: models.Server, Id: 'ip' }));

// Api services
var statusService = require('./api/status');

app.use('/api/status', statusService);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

var serverService = app.service('/api/servers/');
var staleServerThreshhold = 5;

function checkForStaleServers() {    
    models.Server.findAll({
        where: {
            updatedAt: {
                $lt: new Date() - staleServerThreshhold*2*1000,
                $ne: null
            },
            status: 'Stale'
        }
    }).then( (servers) => {
        for (var i = 0; i < servers.length; ++i) {
            serverService.remove(servers[i].id, {}, (err, data) => {
                // server removed
            });
        } 
        
        models.Server.findAll({
            where: {
                updatedAt: {
                    $lt: new Date() - staleServerThreshhold*1000
                }
            }
        }).then( (servers) => {
            console.log('Stale Servers: ' + JSON.stringify(servers));
            for (var i = 0; i < servers.length; ++i) {
                if (servers[i].status != 'Stale') {
                    serverService.patch(servers[i].id,{
                        status: 'Stale'
                    }, {}, (err, data) => {
                        // server updated       
                    });
                }
            }
            setTimeout(checkForStaleServers, 3000);
        });   
    });    
}

checkForStaleServers();


module.exports = app;
