/**
 * Created by SWAT on 2017/7/13.
 */
(function () {
  'use strict';

  angular
    .module('app.benchmarking')
    .service('benchmarkingService', benchmarkingService);

  benchmarkingService.$inject = ['$http', 'SYS_INFO'];
  /** @ngInject */
  function benchmarkingService($http, SYS_INFO) {
    var service = {
      getHy: getHy
    };
    return service;
    ////////////////
    function getHy() {
      return $http({
        // url: 'http://59.52.20.32:38099/CommonData/GetIndustryData.ashx?type=all',
        url: SYS_INFO.SERVER_PATH_DB + '/CommonData/GetIndustryData.ashx?type=all',
        method: 'GET',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }).then(complete)
        .catch(failed);
    }

    function complete(response) {
      return response.data;
    }

    function failed() {
      return false;
    }
  }
})();
