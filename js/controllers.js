function MtaStatusCtrl($scope, $http, Chameleon, version) {

  var bugsense = new Bugsense({ apiKey: '9c5692a1', appversion: version });

  setTimeout(function () {
    Chameleon.init({ version: version });
  }, 1);

  $scope.$on('chameleon.refresh', function () {
    updateStatus();
  });

  $scope.$on('chameleon.load', startPolling);
  $scope.$on('chameleon.resume', startPolling);
  $scope.$on('chameleon.pause', stopPolling);
  $scope.$on('chameleon.connect', startPolling);
  $scope.$on('chameleon.disconnect', stopPolling);
  $scope.$on('chameleon.notchameleon', startPolling);

  $scope.lineClicked = function (line) {
    $scope.$emit('chameleon.openLink', 'http://www.mta.info/status/serviceStatus.html');
  };

  function startPolling(event) {
    stopPolling();
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
    $http.get('http://widgetgecko.com/api/mta/status.json?t=' +  Math.round((new Date()).getTime() / 1000))
      .success(function (data) {
        $scope.lines = data;
        $scope.lastUpdated = new Date();
      })
      .error(function (data, status, headers, config) {
        bugsense.notify(new Error('Update Status Error'));
      });
  }

  $scope.lines = [];
}