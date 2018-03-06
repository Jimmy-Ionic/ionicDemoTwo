(function () {
  'use strict';

  angular
    .module('app.analyse')
    .config(analyseConfig);

  analyseConfig.$inject = ['$stateProvider'];

  /** @ngInject */
  function analyseConfig($stateProvider) {
    $stateProvider
      .state('home.analyse', {
        url: '/analyse',
        cache: true,
        views: {
          'analyse': {
            templateUrl: 'templates/analyse/analyse.html'
          }
        }
      });
  }
}());
