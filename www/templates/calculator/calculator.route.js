(function () {
  'use strict';

  angular
    .module('app.calculator')
    .config(calculatorConfig);

  calculatorConfig.$inject = ['$stateProvider'];

  /** @ngInject */
  function calculatorConfig($stateProvider) {
    $stateProvider
      .state('calculator', {
        url: '/calculator',
        cache: false,
        templateUrl: 'templates/calculator/calculator.html'
        // views: {
        //   'main-content': {
        //     templateUrl: 'templates/calculator/calculator.html'
        //   }
        // }
      });
  }
}());
