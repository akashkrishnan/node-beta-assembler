'use strict';

angular.module('myApp.controllers', [])
  .controller('mainCtrl', mainCtrl);

function mainCtrl($scope, $socket, $log, $window) {

  var socket = new $socket($scope);

  // Assemble textarea change event
  $scope.assemble = function () {
    socket.emit('assemble', $scope.assembly);
  };

  // Reconnect event from server
  socket.on('reconnect', function () {
    $window.location.href = '/';
  });

  // Assemble event from server
  socket.on('assemble', function (data) {
    if (data) {
      if (data.err) $log.warn(err);
      $scope.$apply(function () {
        $scope.output = data.result;
      });
    }
  });

}
