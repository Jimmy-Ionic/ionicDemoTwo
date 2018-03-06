(function () {
  'use strict';

  angular
    .module('app.setting')
    .config(settingConfig);

  settingConfig.$inject = ['$stateProvider'];

  /** @ngInject */
  function settingConfig($stateProvider) {
    $stateProvider
      .state('home.setting', {
        url: '/setting',
        cache:false,
        views: {
          'setting': {
            templateUrl: 'templates/setting/setting.html'
          }
        }
      });
  }
}());
