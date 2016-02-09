var buildManagerApp = angular.module('buildManagerApp', ['socket.io', 'ui.bootstrap', 'smart-table']);

buildManagerApp.filter('reverse', function() {
    return function(items) {
        return items.slice().reverse();
    };
});

buildManagerApp.controller('BuildListCtrl', function ($scope, $socket) {
  $scope.builds = [];
  
  $scope.totalItems = $scope.builds.length;
  $scope.itemsByPage = 5;
  
  $socket.on('api/builds created', function(newbuild) {
      console.log(newbuild);
      $scope.builds.unshift(newbuild);
  });
  
  $socket.on('api/builds updated', function(newbuild) {
      console.log(newbuild);
      for (var i = $scope.builds.length - 1; i >=0; --i) {
          if ($scope.builds[i].id == newbuild.id) {
              $scope.builds[i] = newbuild;
              return;
          }
      }
      
  });
  
  $socket.on('api/builds patched', function(newbuild) {
      console.log(newbuild);
      for (var i = $scope.builds.length - 1; i >=0; --i) {
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