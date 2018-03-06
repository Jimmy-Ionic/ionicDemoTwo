(function () {
  'use strict';

  angular
    .module('app.ESA')
    .service('ESAService', ESAService);

  ESAService.$inject = ['$rootScope', '$http', 'SYS_INFO'];
  /** @ngInject */
  function ESAService($rootScope, $http, SYS_INFO) {
    var service = {
      getData: getData
    };

    return service;

    ////////////////
    function getData(parm) {
      var data = {
        'isFive': parm.isFive,
        'region': parm.region
      };
      return $http({
        // url: 'http://59.52.20.32:23313/RestService.svc/rest/companyEnergySavingCompleted',
        url: SYS_INFO.SERVER_PATH + '/RestService.svc/rest/companyEnergySavingCompleted',
        method: 'POST',
        data: data
      })
        .then($rootScope.getDatasSuccess)
        .catch($rootScope.getDatasFailed);
    }
  }
})();
