(function () {
    'use strict';

    angular
        .module('app.ECA')
        .service('ECAService', ECAService);

    ECAService.$inject = ['$rootScope', '$http', 'SYS_INFO'];
    /** @ngInject */
    function ECAService($rootScope, $http, SYS_INFO) {
        var service = {
            getECABottomData: getECABottomData,
            getECAEchartsData: getECAEchartsData,
            getEnergyIndexList: getEnergyIndexList,
            getECSAYearAndMonth: getECSAYearAndMonth
        };
        return service;
        //////
        /**
         * 获取页面中的环形Echarts数据
         */
        function getECAEchartsData(queryDataObj) {
            console.log('查询Top数据:' + JSON.stringify(queryDataObj));
            var dataObj = {
                "timeType": queryDataObj.timeType,
                "time": queryDataObj.time,
                "regionId": queryDataObj.regionId,
                "tradeId": queryDataObj.tradeId
            };
            return $http({
                url: SYS_INFO.SERVER_PATH + '/RestService.svc/rest/getECSAChart',
                method: 'POST',
                data: dataObj
            }).then($rootScope.getDatasSuccess)
                .catch($rootScope.getDatasFailed);
        }
        /**
         * 获取页面下半部分的数据
         */
        function getECABottomData(queryDataObj) {
            var dataObj = {
                energyid: queryDataObj.energyId,
                timeType: queryDataObj.timeType,
                time: queryDataObj.time,
                regionId: queryDataObj.regionId,
                tradeId: queryDataObj.tradeId
            };
            console.log('查询Bottom数据:' + JSON.stringify(dataObj));
            if (dataObj) {
                switch (dataObj.timeType) {
                    case 'month':
                        return $http({
                            url: SYS_INFO.SERVER_PATH + '/RestService.svc/rest/getECSABottomMonth',
                            method: 'POST',
                            data: dataObj
                        }).then($rootScope.getDatasSuccess)
                            .catch($rootScope.getDatasFailed);
                        break;
                    case 'year':
                        return $http({
                            url: SYS_INFO.SERVER_PATH + '/RestService.svc/rest/getECSABottomYear',
                            method: 'POST',
                            data: dataObj
                        }).then($rootScope.getDatasSuccess)
                            .catch($rootScope.getDatasFailed);
                        break;
                    default:
                        break;
                }
            }
        }

        /**
         * 获取最近5年还有本年度12个月的数据
         */
        function getECSAYearAndMonth(queryDataObj) {
            var dataObj = {
                "timeType": queryDataObj.timeType,
                "time": queryDataObj.time,
                "regionId": queryDataObj.regionId,
                "tradeId": queryDataObj.tradeId
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
        /**
         * 把所有的指标放到这个方法，方便修改指标值
         */
        function getEnergyIndexList() {
            return {
                energyAll: 'bf2398e3-1694-4295-a7ef-75a6e08e637a',
                power: 'd41c2746-6fda-e5d6-4fed-254ba6902ff9',
                coal: '078954d2-e6be-d89d-1560-d8afff49397e',
                naturalGas: 'ca23b33c-88bf-c4e5-ae59-80f9f43ef343',
                heat: 'b0c1a6f5-0ef4-2712-9ccf-13dd0d1ca53e',
                oil: '4f19c85d-4a1c-3572-0f02-3e418995d04d'
            }
        }
    }
})();
