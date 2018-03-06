(function () {
  'use strict';

  angular
    .module('app.home')
    .factory('homeService', homeService);

  homeService.$inject = ['$http', 'SYS_INFO', 'Session'];

  function homeService($http, SYS_INFO, Session) {
    var service = {};

    return service;

    ////////////////
  }
})();
