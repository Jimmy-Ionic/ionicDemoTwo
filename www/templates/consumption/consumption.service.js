(function () {
    'use strict';
    angular.module('app.consumption').service('consumptionService', consumptionService);
    consumptionService.$inject = ['$rootScope', '$http', 'SYS_INFO'];
    /** @ngInject */
    function consumptionService($rootScope, $http, SYS_INFO) {
        var service = {
            getData: getData
        };
        return service;

        function getData(indexId, indexType, timeType, time) {
            var data = {
                "indexType": indexType,
                "indexId": indexId,
                "timeType": timeType,
                "time": time
            }
            // console.log(JSON.stringify(data));
            // console.log(SYS_INFO.SERVER_PATH + '/RestService.svc/rest/getOutputData');
            return $http({
                method: 'POST',
                url: SYS_INFO.SERVER_PATH + '/RestService.svc/rest/getOutputData',
                data: {
                    "indexId": indexId,
                    "indexType": indexType,
                    "timeType": timeType,
                    "time": time
                }
            }).then($rootScope.getDatasSuccess).catch($rootScope.getDatasFailed);
        }    
    }
    //////
})();
