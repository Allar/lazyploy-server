var alertsCtrl = angular.module('alertsCtrl', ['ui.bootstrap.alert']);

alertsCtrl.controller('AlertsCtrl', function ($scope, $rootScope) {
    
    $scope.alerts = [];
    
    $rootScope.$on('newAlert', (event, data) => {
       $scope.alerts.push(data); 
    });
    
    $scope.addAlert = (desc, type, link) => {
        $scope.alerts.push({desc: desc, type: type, link: link});
    };
    
    $scope.closeAlert = function(index) {
        $scope.alerts.splice(index, 1);
    }
  
});