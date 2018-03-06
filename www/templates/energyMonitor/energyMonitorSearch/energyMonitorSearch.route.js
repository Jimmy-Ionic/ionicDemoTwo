(function () {
  'use strict';

  angular
    .module('app.energyMonitorSearch')
    .config(energyMonitorSearchConfig);

    energyMonitorSearchConfig.$inject = ['$stateProvider'];

  /** @ngInject */
  function energyMonitorSearchConfig($stateProvider) {
    $stateProvider
      .state('energyMonitorSearch', {
        url: '/energyMonitorSearch',
        cache:false,
        templateUrl: 'templates/energyMonitor/energyMonitorSearch/energyMonitorSearch.html'
      });
    }
}());
