(function () {
  'use strict';

  angular.module('app.home')
    .config(homeRouteConfig);

  homeRouteConfig.$inject = ['$stateProvider'];

  function homeRouteConfig($stateProvider) {
    $stateProvider
      .state('home', {
        url: '/home',
        templateUrl: 'templates/home/home.html'
        // views: {
        //   'main-content': {
        //     templateUrl: 'templates/home/home.html'
        //   }
        // }
      });
  }
})();
