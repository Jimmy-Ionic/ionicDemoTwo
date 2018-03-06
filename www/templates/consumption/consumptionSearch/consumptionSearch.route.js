(function () {
  'use strict';

  angular
    .module('app.consumptionSearch')
    .config(consumptionSearchConfig);

    consumptionSearchConfig.$inject = ['$stateProvider'];

  /** @ngInject */
  function consumptionSearchConfig($stateProvider) {
    $stateProvider
      .state('consumptionSearch', {
        url: '/consumptionSearch/:indexId/:indexName/:indexType',
        cache: false,
        templateUrl: 'templates/consumption/consumptionSearch/consumptionSearch.html'
      
      });
  }
}());
