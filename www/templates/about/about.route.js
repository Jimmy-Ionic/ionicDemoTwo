(function () {
  'use strict';

  angular
    .module('app.about')
    .config(aboutConfig);

  aboutConfig.$inject = ['$stateProvider'];

  /** @ngInject */
  function aboutConfig($stateProvider) {
    $stateProvider
      .state('home.about', {
        url: '/about',
        cache: true,
        views: {
          'about': {
            templateUrl: 'templates/about/about.html'
          }
        }
      });
  }
}());
