function MtaStatusCtrl($scope, $http, chameleon) {

  $scope.$on('chameleon.refresh', function () {
    updateStatus();
  });

  $scope.$on('chameleon.load', startPolling);
  $scope.$on('chameleon.resume', startPolling);
  $scope.$on('chameleon.pause', stopPolling);
  $scope.$on('chameleon.connect', startPolling);
  $scope.$on('chameleon.disconnect', stopPolling);

  $scope.lineClicked = function (line) {
    $scope.$emit('chameleon.openLink', 'http://www.mta.info/status/serviceStatus.html');
  };

  function startPolling(event) {
    updateStatus();
    $scope.$emit('chameleon.polling.start', {
      id: 'status-update',
      interval: 5 * 60,
      callback: function () {
        updateStatus();
      }
    });
  }

  function stopPolling(event) {
    $scope.$emit('chameleon.polling.stop', {
      id: 'status-update'
    });
  }

  function updateStatus() {
    $http.get('http://widgetgecko.com/api/mta/status.json')
      .success(function (data) {
        $scope.lines = data;
        $scope.lastUpdated = new Date();
      })
      .error(function (data, status, headers, config) {
        // TODO: Do something about this error I suppose!
      });
  }

  $scope.lines = [];
}