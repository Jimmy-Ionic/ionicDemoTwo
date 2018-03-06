/**
 * Created by admin on 2017/6/5.
 */
(function () {
  'use strict';

  angular
    .module('app.quotaBenchmarkingSet')
    .config(quotaBenchmarkingSetConfig);

  quotaBenchmarkingSetConfig.$inject = ['$stateProvider'];

  /** @ngInject */
  function quotaBenchmarkingSetConfig($stateProvider) {
    $stateProvider
      .state('quotaBenchmarkingSet', {
        url: '/quotaBenchmarkingSet/{tradeId}/{indexValue}',
        cache: false,
        templateUrl: 'templates/benchmarking/quotaBenchmarkingSet/quotaBenchmarkingSet.html'
        // views: {
        //   'main-content':{
        //     templateUrl: 'templates/quotaBenchmarkingSet/quotaBenchmarkingSet.html'
        //   }
        // }
      });
  }
}());
