(function () {
    'use strict';
    angular.module('app.consumptionSearch').service('consumptionSearchService', consumptionSearchService);
    consumptionSearchService.$inject = ['$rootScope', '$http', 'SYS_INFO'];
    /** @ngInject */
    function consumptionSearchService($rootScope, $http, SYS_INFO) {
        var service = {
            getEnterpriseTree: getEnterpriseTree
          };

          return service;
          
          /**
           * 获取企业树结构数据
           */
          function getEnterpriseTree() {
            return $http({
              method: 'GET',
              url: SYS_INFO.SERVER_PATH + '/RestService.svc/rest/getRegionTree'
            }).then($rootScope.getDatasSuccess).catch($rootScope.getDatasFailed);
          }
    }
    ////////////////
})();