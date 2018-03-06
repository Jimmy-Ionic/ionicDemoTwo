(function () {
  'use strict';

  angular
    .module('app.ESA')
    .config(ESAConfig);

  ESAConfig.$inject = ['$stateProvider'];

  /** @ngInject */
  function ESAConfig($stateProvider) {
    $stateProvider
      .state('ESA', {
        url: '/ESA/:parm',
        templateUrl: 'templates/energysaving/ESA/ESA.html'
        // views: {
        //   'main-content':{
        //     templateUrl: 'templates/ESA/ESA.html'
        //   }
        // }
      });
  }
}());
