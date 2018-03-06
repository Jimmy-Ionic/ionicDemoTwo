
(function () {
  'use strict';

  angular
    .module('app.valueShow')
    .config(valueShowConfig);

  valueShowConfig.$inject = ['$stateProvider'];

  /** @ngInject */
  function valueShowConfig($stateProvider) {
    $stateProvider
      .state('valueShow', {
        url: '/valueShow/{tradeId}/{indexValue}',
        cache: false,
        templateUrl: 'templates/benchmarking/valueShow/valueShow.html'
        // views: {
        //   'main-content':{
        //     templateUrl: 'templates/valueShow/valueShow.html'
        //   }
        // }
      });
  }
}());
