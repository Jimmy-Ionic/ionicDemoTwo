(function () {
  'use strict';

  angular
    .module('app.energyRank')
    .config(energyRankConfig);

  energyRankConfig.$inject = ['$stateProvider'];

  /** @ngInject */
  function energyRankConfig($stateProvider) {
    $stateProvider
      .state('home.energyRank', {
        url: '/energyRank/:condition',
        cache: true,
        views: {
          'energyRank': {
            templateUrl: 'templates/energyRank/energyRank.html'
          }
        }
      });
  }
}());
