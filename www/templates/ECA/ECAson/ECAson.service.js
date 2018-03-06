(function () {
    'use strict';

    angular
        .module('app.ECAson')
        .service('ECAsonService', ECAsonService);

    ECAsonService.$inject = ['$rootScope', '$http', 'SYS_INFO'];
    /** @ngInject */
    function ECAsonService($rootScope, $http, SYS_INFO) {
        var service = {
            getECSAYearAndMonth: getECSAYearAndMonth
        };
        return service;
        /**
         * 获取最近5年还有本年度12个月的数据
         */
        function getECSAYearAndMonth(queryDataObj) {
            var dataObj = {
                timeType: queryDataObj.timeType === 0 ? 'month' : 'year',
                time: queryDataObj.time,
                regionId: queryDataObj.regionId,
                tradeId: queryDataObj.tradeId
            };
            console.log('查询最近5年和本年度12个月的数据:' + JSON.stringify(dataObj));
            if (dataObj) {
                return $http({
                    url: SYS_INFO.SERVER_PATH + '/RestService.svc/rest/getECSAYearAndMonth',
                    method: 'POST',
                    data: dataObj
                }).then($rootScope.getDatasSuccess)
                    .catch($rootScope.getDatasFailed);
            }
        }
    }
})();
