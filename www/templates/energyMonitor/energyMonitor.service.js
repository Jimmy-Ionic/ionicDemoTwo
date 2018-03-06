; (function () {
  'use strict'
  angular.module('app.energyMonitor').service('energyMonitorService', energyMonitorService)
  energyMonitorService.$inject = ['$rootScope', '$http', 'SYS_INFO']
  /** @ngInject */
  function energyMonitorService($rootScope, $http, SYS_INFO) {
    var service = {
      getData: getData
    }
    return service;

    function getData(departId, powerType, time) {
      var mydata = {
        DepartId: departId,
        powerType: powerType,
        time: time
      }
      // console.log(mydata);
      return $http({
        method: 'POST',
        url: SYS_INFO.SERVER_PATH + '/RestService.svc/rest/getHistoryData',
        data: {
          DepartId: departId,
          powerType: powerType,
          time: time
        }
      }).then($rootScope.getDatasSuccess).catch($rootScope.getDatasFailed)
    }
  }
})()
