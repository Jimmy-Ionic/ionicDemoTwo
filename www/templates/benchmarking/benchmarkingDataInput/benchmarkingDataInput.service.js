/**
 * Created by SWAT on 2017/7/13.
 */
(function () {
  'use strict';

  angular
    .module('app.benchmarkingDataInput')
    .service('benchmarkingDataInputService', benchmarkingDataInputService);

  benchmarkingDataInputService.$inject = ['$http', 'SYS_INFO'];
  /** @ngInject */
  function benchmarkingDataInputService($http, SYS_INFO) {
    var service = {
      GetCS: GetCS,
      PostResult: PostResult,
      GetBenchmarkinglist: GetBenchmarkinglist
    };
    return service;
    ////////////////
    function GetCS(tradeId) {
      console.log(SYS_INFO.SERVER_PATH_DB + '/BenchmarkingSystem/FormulaManage/FormulaManage.ashx?op=getindextree&tradeId=' + tradeId + '&childrenIncluded=false');
      return $http({
        url: SYS_INFO.SERVER_PATH_DB + '/BenchmarkingSystem/FormulaManage/FormulaManage.ashx?op=getindextree&tradeId=' + tradeId + '&childrenIncluded=false',
        method: 'GET',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }).then(complete)
        .catch(failed);
    }

    function PostResult(VlueJsn) {
      console.log(VlueJsn);
      return $http({
        url: SYS_INFO.SERVER_PATH_DB + '/BenchmarkingSystem/Benchmarking/RealTime/DataFormulaClac.ashx?op=CalValues',
        method: 'POST'
        ,
        data: {
          VlueJsn: VlueJsn
        }
        ,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          transformRequest: function (obj) {
            var str = [];
            for (var s in obj) {
              str.push(encodeURIComponent(s) + "=" + encodeURIComponent(obj[s]));
            }
            return str.join("&");
          }
        }
      }).then(complete)
        .catch(failed);
    }

    function GetBenchmarkinglist(tradeId) {
      return $http({
        url: SYS_INFO.SERVER_PATH_DB + '/BenchmarkingSystem/Benchmarking/RealTime/RealTime.ashx?type=getIndexAsync&childrenIncluded=false&tradeId=' + tradeId,
        method: 'POST'
      })
        .then(complete)
        .catch(failed);
    }

    function complete(response) {
      return response.data;
    }

    function failed(error) {
      return { failed: true, msg: "获取数据失败" };
    }
  }
})();
