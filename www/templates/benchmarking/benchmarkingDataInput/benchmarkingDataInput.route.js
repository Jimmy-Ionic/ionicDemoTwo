
(function () {
  'use strict';

  angular
    .module('app.benchmarkingDataInput')
    .config(benchmarkingDataInputConfig);

  benchmarkingDataInputConfig.$inject = ['$stateProvider'];

  /** @ngInject */
  function benchmarkingDataInputConfig($stateProvider) {
    $stateProvider
      .state('benchmarkingDataInput', {
        url: '/benchmarkingDataInput/{tradeId}',
        cache: false,
        templateUrl: 'templates/benchmarking/benchmarkingDataInput/benchmarkingDataInput.html'
        // views: {
        //   'main-content':{
        //     templateUrl: 'templates/benchmarkingDataInput/benchmarkingDataInput.html'
        //   }
        // }
      });
  }
}());
