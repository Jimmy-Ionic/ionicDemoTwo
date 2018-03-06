(function () {
  'use strict';

  angular
    .module('app.search')
    .config(searchConfig);

  searchConfig.$inject = ['$stateProvider'];

  /** @ngInject */
  function searchConfig($stateProvider) {
    $stateProvider
      .state('search', {
        url: '/search',
        templateUrl: 'templates/energyRank/search/search.html'
        // views: {
        //   'main-content': {
        //   }
        // }
      });
  }
}());
