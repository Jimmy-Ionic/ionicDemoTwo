/**
 * Created by admin on 2017/6/6.
 */
(function () {
  'use strict';

  angular
    .module('app.quotaBenchmarkingRealTime')
    .config(quotaBenchmarkingRealTimeConfig);

  quotaBenchmarkingRealTimeConfig.$inject = ['$stateProvider'];

  /** @ngInject */
  function quotaBenchmarkingRealTimeConfig($stateProvider) {
    $stateProvider
      .state('quotaBenchmarkingRealTime', {
        url: '/quotaBenchmarkingRealTime/{tradeid}/{standid}/{scope}/{indexValue}/{standardtype}/{standardtypeName}/{url}',
        cache: false,
        templateUrl: 'templates/benchmarking/quotaBenchmarkingRealTime/quotaBenchmarkingRealTime.html'
        // views: {
        //   'main-content':{
        //     templateUrl: 'templates/quotaBenchmarkingRealTime/quotaBenchmarkingRealTime.html'
        //   }
        // }
      });
  }
}());
