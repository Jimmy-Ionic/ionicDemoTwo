(function () {
  'use strict';

  angular
    .module('app.energysaving')
    .service('energysavingService', energysavingService);

  energysavingService.$inject = ['$rootScope', '$http', 'SYS_INFO'];
  /** @ngInject */
  function energysavingService($rootScope, $http, SYS_INFO) {
    var service = {
      getDatas: getDatas,
      getDatasRegion: getDatasRegion
    };

    return service;

    function getDatas(isYear) {
      var isFive = false;
      switch(isYear){
        case 0:
          isFive = false;
          break;
        case 1:
          isFive = true;
          break;
        default:
          break;    
      }
      return $http.get(SYS_INFO.SERVER_PATH + '/RestService.svc/rest/getEnergySaving/' + isFive)
        .then($rootScope.getDatasSuccess)
        .catch($rootScope.getDatasFailed);
    }

    function getDatasRegion() {
      return $http.get(SYS_INFO.SERVER_PATH + '/RestService.svc/rest/regionEnergySavingCompleted')
        .then($rootScope.getDatasSuccess)
        .catch($rootScope.getDatasFailed);
    }
  }
})();