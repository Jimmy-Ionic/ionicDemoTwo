(function () {
    'use strict';

    angular
        .module('app.ECAson')
        .controller('ECAsonController', ECAsonController);

    ECAsonController.$inject = ['$rootScope', '$scope', '$ionicSlideBoxDelegate', '$state', '$stateParams', 'ECAsonService', '$timeout', '$ionicPopup'];
    /** @ngInject */
    function ECAsonController($rootScope, $scope, $ionicSlideBoxDelegate, $state, $stateParams, ECAsonService, $timeout, $ionicPopup) {
        var vm = this;
        var parms = buildParams();
        var backParms = {};
        ///////////////////////////////////////
        vm.lChart = {};
        vm.bChart = {};
        vm.ecaSonData = {};
        vm.queryParams = {};
        vm.d1 = '-';
        vm.d2 = '-';
        vm.d3 = '-';
        vm.chartGlobalConfig = {
            theme: 'shine',
            dataLoaded: true
        };
        vm.fun = {
            goBack: goBack
        };
        //////
        activated();

        function activated() {
            $scope.$on('$ionicView.beforeEnter', function (event, view) {
                initPageData();
                getPageData();
            }); 
        }
        /**
         * 初始化页面相关的数据，比如$statePramas 
         */
        function initPageData() {
            console.log($stateParams.ecaSonData);
            if ($stateParams.ecaSonData) {
                vm.ecaSonData = $stateParams.ecaSonData;//处理从上一页面传递过来的数据
                vm.d1 = vm.ecaSonData.energyXFL;
                vm.d2 = vm.ecaSonData.energyXFLTB;
                backParms.name = $stateParams.ecaSonData.name;
                backParms.regionId = $stateParams.ecaSonData.regionId;
                backParms.tradeId = $stateParams.ecaSonData.tradeId;
                backParms.timeType = $stateParams.ecaSonData.timeType;
                backParms.time = $stateParams.ecaSonData.time;
                vm.queryParams = {
                    energyId: vm.ecaSonData.energyId,
                    timeType: vm.ecaSonData.timeType,
                    time: vm.ecaSonData.time,
                    regionId: vm.ecaSonData.regionId,
                    tradeId: vm.ecaSonData.tradeId
                }
            }
        }

        function buildlChart(data, tqpj, bqpj) {
            var dataLabel = [];
            var databq = [];
            var datatq = [];
            var databqpj = [];
            var datatqpj = [];
            for (var i = 0; i < data.length; i++) {
                databqpj[i] = $rootScope.filterNumber(bqpj, 2);
                datatqpj[i] = $rootScope.filterNumber(tqpj, 2);
            }
            for (var i = 0; i < data.length; i++) {
                if (data[i].date) {
                    var echartsDateList = data[i].date.split('/'); 
                    dataLabel[i] = echartsDateList[1];
                } else {
                    dataLabel[i] = '-';
                }
                if (data[i].bqdata) {
                    databq[i] = $rootScope.filterNumber(data[i].bqdata, 2);
                } else {
                    databq[i] = 0;
                }
                if (data[i].tqdata) {
                    datatq[i] = $rootScope.filterNumber(data[i].tqdata, 2);
                } else {
                    datatq[i] = 0;
                }
            }
            var dataOption = {
                animation: false,
                title: {
                    subtext: '单位：万吨标准煤/万元',
                },
                legend: {
                    data: ['本期值', '同期值', '本期平均值', '同期平均值']
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    },
                    position: ['30%', '50%'],
                    hideDelay: 20,
                    alwaysShowContent: false
                },
                xAxis: [{
                    type: 'category',
                    axisTick: {
                        alignWithLabel: true
                    },
                    data: dataLabel
                }],
                grid: {
                    left: '20%',
                    right: '10%',
                    top: '30%',
                    bottom: '15%'
                },
                yAxis: [{
                    type: 'value',
                    axisLabel: {
                        // formatter: function (v) {
                        //     if (v) {
                        //         return (v / 10000) + '万';
                        //     } else {
                        //         return $rootScope.filterNumber(v / 10000, 2) + '万';
                        //     }
                        // }
                    }
                    // scale: true
                }],
                series: [{
                    type: 'bar',
                    name: '本期值',
                    data: databq,
                    itemStyle: {
                        normal: {
                            color: '#20aee5'
                        }
                    }
                }, {
                    type: 'bar',
                    name: '同期值',
                    data: datatq,
                    itemStyle: {
                        normal: {
                            color: '#CDCDCD'
                        }
                    }
                }, {
                    type: 'line',
                    data: databqpj,
                    symbol: 'none',
                    name: '本期平均值',
                    itemstyle: {
                        normal: {
                            color: 'red'
                        }
                    },
                    lineStyle: {
                        normal: {
                            type: 'dotted'
                        }
                    }
                }, {
                    type: 'line',
                    name: '同期平均值',
                    data: datatqpj,
                    symbol: 'none',
                    itemstyle: {
                        normal: {
                            color: 'green'

                        }
                    },
                    lineStyle: {
                        normal: {
                            type: 'dotted'
                        }
                    }
                }]
            };
            return dataOption;
        };

        function buildbChart(data) {
            var label = [];
            var nums = [];
            for (var i = 0; i < data.length; i++) {
                if (data[i].date) {
                    label[i] = data[i].date;
                } else {
                    label[i] = '-';
                }
                if (data[i].data) {
                    nums[i] = $rootScope.filterNumber(data[i].data, 2);
                } else {
                    nums[i] = 0;
                }
            }
            var dataOption = {
                animation: false,
                title: {
                    subtext: '单位：万吨标准煤/万元',
                },
                legend: {
                    data: ['近五年变化趋势']
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    },
                    position: ['30%', '50%'],
                    hideDelay: 20,
                    alwaysShowContent: false
                },
                grid: {
                    left: '20%',
                    right: '10%',
                    top: '30%',
                    bottom: '15%'
                },
                xAxis: [{
                    type: 'category',
                    axisTick: {
                        alignWithLabel: true
                    },
                    data: label
                }],
                yAxis: [{
                    type: 'value'
                    // scale: true
                    // axisLabel: {
                    //     formatter: function (v) {
                    //         return (v / 10000) + '万';
                    //     }
                    // }
                }],
                series: [{
                    type: 'bar',
                    name: '近五年变化趋势',
                    data: nums,
                    itemStyle: {
                        normal: {
                            color: '#20aee5'
                        }
                    }
                }]
            };
            return dataOption;
        };

        function goBack() {
            $state.go('ECA', backParms);
        };

        /**
         * 从服务器获取页面中的所有数据
         */
        function getPageData() {
            $rootScope.showLoadingDialog();
            ECAsonService.getECSAYearAndMonth(vm.queryParams)
                .then(function (datas) {
                    $rootScope.hideLoadingDialog();
                    datas = JSON.parse(datas);
                    if (datas.failed) {
                        $ionicPopup.alert({
                            title: '提示',
                            template: datas.msg
                        })
                    } else {
                        sort(datas.dataMonth);
                        datas.dataMonth = _.sortBy(datas.dataMonth, function (item) {
                            return item.flag;
                        });
                        sortYear(datas.dataYear);
                        datas.dataYear = _.sortBy(datas.dataYear, function (item) {
                            return item.flag;
                        });
                        vm.lChart = buildlChart(datas.dataMonth, datas.tqzbpjz, datas.bqzbpjz);
                        vm.bChart = buildbChart(datas.dataYear);
                        vm.d3 = $rootScope.filterNumber(datas.bqzbpjz, 2);;
                    }
                });
        };

        function sort(data) {
            for (var i = 0; i < data.length; i++) {
                var flag = parseInt(data[i].date.substr(0, 4) + sortFormat(data[i].date.substr(5, data[i].date.indexOf('月'))));
                data[i].flag = flag;
            }
        };

        function sortYear(data) {
            for (var i = 0; i < data.length; i++) {
                var flag = parseInt(data[i].date.substr(0, 4));
                data[i].flag = flag;
            }
        };

        function sortFormat(data) {
            var num = parseInt(data);
            if (num < 10) {
                num = '0' + num;
            }
            return num;
        };

        /**
         * build要发送给服务器的参数
         */
        function buildParams() {
            var data = {
                timeType: 'year',
                time: '',
                area: 'null',
                industry: 'null'
            };
            data.timeType = $stateParams.timeType;
            data.time = $stateParams.time;
            data.area = $stateParams.area;
            data.industry = $stateParams.industry;
            return data;
        }
    }
})();