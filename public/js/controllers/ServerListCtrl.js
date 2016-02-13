var serverListCtrl = angular.module('serverListCtrl', ['socket.io', 'angular-table']);

serverListCtrl.controller('ServerListCtrl', function ($scope, $socket) {
    
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
      console.log(newserver);
      $scope.servers.unshift(newserver);
  });
  
  $socket.on('api/servers updated', function(newserver) {
      console.log(newserver);
      for (var i = 0; i < $scope.servers.length; ++i) {
          if ($scope.servers[i].id == newserver.id) {
              $scope.servers[i] = newserver;
              return;
          }
      }
      
  });
  
  $socket.on('api/servers patched', function(newserver) {
      console.log(newserver);
      for (var i = 0; i < $scope.servers.length; ++i) {
          if ($scope.servers[i].id == newserver.id) {
              $scope.servers[i] = newserver;
              return;
          }
      }
  });
  
  $socket.emit('api/servers::find', {
      $sort: { id: -1 }
  }, function (error, data) {
      if (error) console.error(error);
      if (data) console.log(data);
      $scope.servers = (data);
  });
  
});