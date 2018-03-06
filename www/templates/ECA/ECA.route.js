(function () {
  'use strict';

  angular
    .module('app.ECA')
    .config(ECAConfig);

  ECAConfig.$inject = ['$stateProvider'];

  /** @ngInject */
  function ECAConfig($stateProvider) {
    $stateProvider
      .state('ECA', {
        url: '/ECA/:name/:regionId/:tradeId/:timeType/:time',
        cache: false,
        templateUrl: 'templates/ECA/ECA.html',
        // views: {
        //   'main-content': {
        //     templateUrl: 'templates/ECA/ECA.html'
        //   }
        // }
      });
  }
}());
