(function () {
  'use strict';

  angular
    .module('app.valueShow')
    .service('valueShowService', valueShowService);

  valueShowService.$inject = ['$http'];
  /** @ngInject */
  function valueShowService($http) {
    var service = {};
    return service;
    ////////////////
  }
})();
