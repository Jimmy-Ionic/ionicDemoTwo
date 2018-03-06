(function () {
    'use strict';
    angular.module('app.energyRank').service('energyRankService', energyRankService);
    energyRankService.$inject = ['$rootScope', '$http', 'SYS_INFO'];
    /** @ngInject */
    function energyRankService($rootScope, $http, SYS_INFO) {
        var service = {
            getData: getData
        };
        return service;

        function getData(indexId, timeType, date) {
            // console.log(indexId + '/' + timeType + '/' + date);
            // console.log(SYS_INFO.SERVER_PATH + '/RestService.svc/rest/getEnergyPublicity');
            return $http({
                method: 'POST',
                data: {
                    'IndexId': indexId,
                    'timeType': timeType,
                    'time': date
                },
                url: SYS_INFO.SERVER_PATH + '/RestService.svc/rest/getEnergyPublicity'
            }).then(getDataComplete).catch(getDatasFailed);
        }

        function getDataComplete(response) {
            // console.log(response.data);
            var responseObj = JSON.parse(response.data);
            var returnObj =
                {
                    totalValue: '-',
                    totalValueYOY: '-',
                    totalValueLRR: '-',
                    areaValueList: [],
                    industryValueList: [],
                    enterpriseValueList: []
                };//返回给controller的数据
            if (responseObj && !responseObj.failed) {
                returnObj.totalValue = $rootScope.filterNumber(responseObj.totalValue, 2);
                returnObj.totalValueYOY = $rootScope.filterNumber(responseObj.totalValueYOY, 2);
                returnObj.totalValueLRR = $rootScope.filterNumber(responseObj.totalValueLRR, 2);
                for (var x in responseObj.areaValueList) {
                    var areaValueObj = {};
                    areaValueObj.orderNo = responseObj.areaValueList[x].orderNo;
                    if (responseObj.areaValueList[x].name == '梅里斯达斡尔族区') {
                        areaValueObj.name = '梅里斯';
                    } else {
                        areaValueObj.name = responseObj.areaValueList[x].name;
                    }
                    areaValueObj.value = $rootScope.filterNumber(responseObj.areaValueList[x].value, 2);
                    areaValueObj.ratio = $rootScope.filterNumber(responseObj.areaValueList[x].ratio, 2);
                    returnObj.areaValueList.push(areaValueObj);
                }
                for (var x in responseObj.industryValueList) {
                    var industryValueObj = {};
                    industryValueObj.orderNo = responseObj.industryValueList[x].orderNo;
                    industryValueObj.name = responseObj.industryValueList[x].name;
                    industryValueObj.value = $rootScope.filterNumber(responseObj.industryValueList[x].value, 2);
                    industryValueObj.ratio = $rootScope.filterNumber(responseObj.industryValueList[x].ratio, 2);
                    returnObj.industryValueList.push(industryValueObj);
                }
                for (var x in responseObj.enterpriseValueList) {
                    var enterpriseValueObj = {};
                    enterpriseValueObj.orderNo = responseObj.enterpriseValueList[x].orderNo;
                    enterpriseValueObj.name = responseObj.enterpriseValueList[x].name;
                    enterpriseValueObj.value = $rootScope.filterNumber(responseObj.enterpriseValueList[x].value, 2);
                    enterpriseValueObj.ratio = $rootScope.filterNumber(responseObj.enterpriseValueList[x].ratio, 2);
                    returnObj.enterpriseValueList.push(enterpriseValueObj);
                }
                return returnObj;
            } else {
                return JSON.parse(response.data);
            }
        }
        /**
         * 失败之后的回调方法
         * @param {*} error 
         */
        function getDatasFailed(error) {
            var result = {};
            switch (error.status) {
                case -1:
                    result = { failed: true, msg: "网络连接不稳定，请检查网络情况" };
                    break;
                case 404:
                    result = { failed: true, msg: "请求的资源不存在" };
                    break;
                default:
                    result = { failed: true, msg: error.status + ' ' + error.statusText };
                    break;
            }
            return result;
        }
    }
    ////////////////
})();