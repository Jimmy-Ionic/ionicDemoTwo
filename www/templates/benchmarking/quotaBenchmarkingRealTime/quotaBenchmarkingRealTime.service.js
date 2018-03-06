/**
 * Created by admin on 2017/6/6.
 */
(function () {
  'use strict';

  angular
    .module('app.quotaBenchmarkingRealTime')
    .service('quotaBenchmarkingRealTimeService', quotaBenchmarkingRealTimeService);

  quotaBenchmarkingRealTimeService.$inject = ['$http', 'SYS_INFO'];
  /** @ngInject */
  function quotaBenchmarkingRealTimeService($http, SYS_INFO) {

    var service = {
      GetBenchMarking: GetBenchMarking
    };

    return service;

    function GetBenchMarking(tradeid, standid, scope, indexValue) {
      return $http({
        url: SYS_INFO.SERVER_PATH_DB + '/BenchmarkingSystem/Benchmarking/RealTime/RealTime.ashx?type=getBenchMarking&tradeid=' + tradeid + '&standid=' + standid + '&scope=' + scope + '&indexValue=' + indexValue,
        method: 'POST'
      })
        .then(getDatasSuccess)
        .catch(getDatasFaild);
    }


    function getDatasSuccess(response) {

      return response.data;
    }

    function getDatasFaild() {
      var result = {
        failed: true
      };

      return result;
    }
    ////////////////
  }
})();
