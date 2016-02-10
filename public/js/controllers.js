var buildManagerApp = angular.module('buildManagerApp', ['socket.io', 'ui.bootstrap', 'smart-table', 'angular-table']);

buildManagerApp.filter('reverse', function() {
    return function(items) {
        return items.slice().reverse();
    };
});

buildManagerApp.controller('BuildListCtrl', function ($scope, $socket) {
    
  $scope.builds = [];
  
  $scope.atconfig = {
      itemsPerPage: 5,
      fillLastPage: true
  }
  
  $scope.totalItems = $scope.builds.length;
  $scope.itemsByPage = 5;
  
  $scope.getTableRowClass = function(item) {
      if (item.status.includes("Completed")) {
          return 'success';
      }
      if (item.status.includes("Failed")) {
          return 'danger';
      }
      if (item.status.includes("Canceled")) {
          return 'warning';
      }
  }
  
  $socket.on('api/builds created', function(newbuild) {
      console.log(newbuild);
      $scope.builds.unshift(newbuild);
  });
  
  $socket.on('api/builds updated', function(newbuild) {
      console.log(newbuild);
      for (var i = 0; i < $scope.builds.length; ++i) {
          if ($scope.builds[i].id == newbuild.id) {
              $scope.builds[i] = newbuild;
              return;
          }
      }
      
  });
  
  $socket.on('api/builds patched', function(newbuild) {
      console.log(newbuild);
      for (var i = 0; i < $scope.builds.length; ++i) {
          if ($scope.builds[i].id == newbuild.id) {
              $scope.builds[i] = newbuild;
              return;
          }
      }
  });
  
  $socket.emit('api/builds::find', {
      $sort: { id: -1 }
  }, function (error, data) {
      if (error) console.error(error);
      if (data) console.log(data);
      $scope.builds = (data);
  });
  
});