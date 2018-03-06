;(function () {
  'use strict'

  angular
    .module('app.energyMonitor')
    .config(analyseConfig)

  analyseConfig.$inject = ['$stateProvider']

  /** @ngInject */
  function analyseConfig ($stateProvider) {
    $stateProvider
      .state('energyMonitor', {
        // url: '/energyAnalyze/{id}/{name}',
        url: '/energyMonitor/:enterpriseId/:enterpriseName',
        // url: '/energyMonitor/{id}/{name}',
        cache: true,
        templateUrl: 'templates/energyMonitor/energyMonitor.html'
        // views: {
        //   'main-content': {
        //     templateUrl: 'templates/energyMonitor/energyMonitor.html'
        //   }
        // }
      })
  }
}())
