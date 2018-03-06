
(function () {
  'use strict';

  angular
    .module('app.benchmarking')
    .config(benchmarkingConfig);

  benchmarkingConfig.$inject = ['$stateProvider'];

  /** @ngInject */
  function benchmarkingConfig($stateProvider) {
    $stateProvider
      .state('benchmarking', {
        url: '/benchmarking',
        cache: false,
        templateUrl: 'templates/benchmarking/benchmarking.html'
        // views: {
        //   'main-content':{
        //     templateUrl: 'templates/benchmarking/benchmarking.html'
        //   }
        // }
      });
  }
}());
