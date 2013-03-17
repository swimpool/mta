angular.module('widget.services', [])

  .factory('chameleon', function ($rootScope) {

    chameleon.widget({

      onLoad: function () {
        $rootScope.$broadcast('chameleon.load');
      },

      onCreate: function () {
        $rootScope.$broadcast('chameleon.create');
      },

      onResume: function () {
        $rootScope.$broadcast('chameleon.resume');
      },

      onPause: function () {
        $rootScope.$broadcast('chameleon.pause');
      },

      onConnectionAvailableChanged: function (available) {
        if (available) {
          $rootScope.$broadcast('chameleon.connect');
        }
        else {
          $rootScope.$broadcast('chameleon.disconnect');
        }
      },

      onRefresh: function () {
        $rootScope.$broadcast('chameleon.refresh');
      },

      notChameleon: function () {
        $rootScope.$broadcast('chameleon.notchameleon');
      }

    });

    $rootScope.$on('chameleon.polling.start', function (event, data) {
      chameleon.poll({
        id: data.id,
        action: 'start',
        interval: data.interval * 1000,
        callback: data.callback
      });
    });

    $rootScope.$on('chameleon.polling.stop', function (event, data) {
      chameleon.poll({
        id: data.id,
        action: 'stop'
      });
    });

    $rootScope.$on('chameleon.setTitle', function (event, title) {
      chameleon.setTitle({ text: title });
    });

    $rootScope.$on('chameleon.openLink', function (url) {
      if (chameleon.connected()) {
        chameleon.intent({
          action: 'android.intent.action.VIEW',
          data: url
        });
      }
    });

  });