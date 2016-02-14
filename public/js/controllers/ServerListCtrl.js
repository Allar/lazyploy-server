var serverListCtrl = angular.module('serverListCtrl', ['socket.io', 'angular-table']);

serverListCtrl.controller('ServerListCtrl', function ($scope, $rootScope, $socket) {
    
    $scope.servers = [];

    $scope.atconfig = {
        itemsPerPage: 5,
        fillLastPage: false
    }

    $scope.getTableRowClass = function(item) {
        if (item.status.includes("Running")) {
            return 'success';
        }
        
        if (item.status.includes("ERROR") || item.status.includes("Down")) {
            return 'danger';
        }
        
        return 'warning';
    }

    $socket.on('api/servers created', function(newserver) {
        $scope.servers.unshift(newserver);
    });

    $socket.on('api/servers updated', function(newserver) {
        for (var i = 0; i < $scope.servers.length; ++i) {
            if ($scope.servers[i].id == newserver.id) {
                $scope.servers[i] = newserver;
                return;
            }
        }
        
    });

    $socket.on('api/servers patched', function(newserver) {
        for (var i = 0; i < $scope.servers.length; ++i) {
            if ($scope.servers[i].id == newserver.id) {
                $scope.servers[i] = newserver;
                return;
            }
        }
    });

    $socket.on('api/servers removed', function(removedserver) {
        for (var i = 0; i < $scope.servers.length; ++i) {
            if ($scope.servers[i].id == removedserver.id) {
                $scope.servers.splice(i, 1);
                $rootScope.$emit('newAlert', {
                    desc: `${removedserver.project} Server (${removedserver.hostname}) at ${removedserver.localip} went stale!`,
                    type: 'danger',
                    link: null
                });
                break;
            }
        }
    });

    $socket.emit('api/servers::find', {
        $sort: { id: -1 }
    }, function (error, data) {
        if (error) console.error(error);
        $scope.servers = (data);
    });
  
});