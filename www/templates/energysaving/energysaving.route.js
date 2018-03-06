(function () {
  'use strict';

  angular
    .module('app.energysaving')
    .config(analyseConfig);

  analyseConfig.$inject = ['$stateProvider'];

  /** @ngInject */
  function analyseConfig($stateProvider) {
    $stateProvider
      .state('energysaving', {
        url: '/energysaving',
        cache: false,
        templateUrl: 'templates/energysaving/energysaving.html'
      });
    }
}());