(function () {
  'use strict';

  angular
    .module('app.news')
    .config(newsConfig);

  newsConfig.$inject = ['$stateProvider'];

  /** @ngInject */
  function newsConfig($stateProvider) {
    $stateProvider
      .state('news', {
        url: '/news',
        cache: true,
        templateUrl: 'templates/news/news.html'
      });
  }
}());
