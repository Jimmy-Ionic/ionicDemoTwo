(function () {
  'use strict';

  angular
    .module('app.setting')
    .service('settingService', settingService);

  settingService.$inject = ['$http', 'SYS_INFO'];
  /** @ngInject */
  function settingService($http, SYS_INFO) {
    var service = {};

    return service;

    ////////////////
  }
})();
