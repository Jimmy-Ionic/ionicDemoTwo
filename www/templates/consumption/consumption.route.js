(function () {
  'use strict';

  angular
    .module('app.consumption')
    .config(analyseConfig);

    analyseConfig.$inject = ['$stateProvider'];

  /** @ngInject */
  function analyseConfig($stateProvider) {
    $stateProvider
      .state('consumption', {
        // url: '/consumption/:indexId/:indexType/:timeType/:time/:enterpriseName',
        url: '/consumption',
        params: {
          sendData: null
        },
        cache: true,
        templateUrl: 'templates/consumption/consumption.html'
      
      });
  }
}());
