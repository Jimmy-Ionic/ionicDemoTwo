/**
 * Created by admin on 2017/6/5.
 */
(function () {
  'use strict';

  angular
    .module('app.quotaBenchmarkingSet')
    .service('quotaBenchmarkingSetService', quotaBenchmarkingSetService);

  quotaBenchmarkingSetService.$inject = ['$http', 'SYS_INFO'];
  /** @ngInject */
  function quotaBenchmarkingSetService($http, SYS_INFO) {

    var service = {
      GetStandardType: GetStandardType,
      ConstructScope: ConstructScope,
      GetAllScope: GetAllScope
    };

    return service;

    function GetStandardType() {
      return $http({
        url: SYS_INFO.SERVER_PATH_DB + '/BenchmarkingSystem/Benchmarking/DataController/StandardTypeManagement.ashx?type=gettargettype&id=fcdf8558-3e66-45d4-ac58-f9a6d46c61dc',
        method: 'POST'
      })
        .then(getDatasSuccess)
        .catch(getDatasFaild);
    }

    function ConstructScope(tradeid) {
      return $http({
        url: SYS_INFO.SERVER_PATH_DB + '/BenchmarkingSystem/Benchmarking/RealTime/RealTime.ashx?type=getScopeTargetValue&tradeid=' + tradeid,
        method: 'POST'
      })
        .then(getDatasSuccess)
        .catch(getDatasFaild);
    }

    function GetAllScope(tradeid) {
      return $http({
        url: SYS_INFO.SERVER_PATH_DB + '/BenchmarkingSystem/Benchmarking/DataController/ScopeManagement.ashx?type=getall&tradeid=' + tradeid,
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
