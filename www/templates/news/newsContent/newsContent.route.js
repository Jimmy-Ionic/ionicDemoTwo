(function () {
  'use strict';

  angular
    .module('app.newsContent')
    .config(newsContentConfig);

  newsContentConfig.$inject = ['$stateProvider'];

  /** @ngInject */
  function newsContentConfig($stateProvider) {
    $stateProvider
      .state('newsContent', {
        url: '/newsContent/{id}/{title}',
        cache: false,
        templateUrl: 'templates/news/newsContent/newsContent.html'
      });
  }
}());
