(function () {
  'use strict';

  angular
    .module('app.about')
    .service('aboutService', aboutService);

  aboutService.$inject = ['$http'];
  /** @ngInject */
  function aboutService($http) {
    var service = {};

    return service;

    ////////////////
  }
})();
