(function () {
    'use strict'
    angular.module('app.consumption').controller('consumptionController', consumptionController)
    consumptionController.$inject = ['$rootScope', '$scope', 'consumptionService', '$ionicPopup', '$timeout', 'MonthPicker', '$stateParams', '$ionicLoading']
    /** @ngInject */
    function consumptionController($rootScope, $scope, consumptionService, $ionicPopup, $timeout, MonthPicker, $stateParams, $ionicLoading) {
        var vm = this;
        var dateFormat = 'YYYY年MM月';
        var sendDateFormat = 'YYYY-MM';
        var fiveYearList = [];//近5年的年数组
        var monthList = [];
        vm.currentDate = moment().subtract(1, 'months').format(dateFormat);
        vm.sendDate = moment().subtract(1, 'months').format(sendDateFormat) + '-01';
        vm.indexId = '齐齐哈尔市';
        vm.indexName = '齐齐哈尔市';
        vm.indexType = 'area';//默认查询的指标为企业
        vm.timeType = 'month';
        vm.energyConsumptionValue = '-';
        vm.energyConsumptionValueYOY = '-';//同比
        vm.energyConsumptionValueLRR = '-';//环比
        vm.powerConsumptionValue = '-';//万元产值电耗
        vm.chartsOption = {};
        vm.chartGlobalConfig = {
            theme: 'shine',
            dataLoaded: true
        };
        vm.fun = {
        };
        ////////
        activate()

        function activate() {
            $scope.$on('$ionicView.beforeEnter', function (event, view) {
                initPageData();
                getPageData();
            });
        }
        /**
         * 初始化页面的数据
         */
        function initPageData() {
            console.log($stateParams.sendData);
            if ($stateParams.sendData) {
                if ($stateParams.sendData.indexId) {
                    vm.indexId = $stateParams.sendData.indexId;
                }
                if ($stateParams.sendData.indexTye) {
                    vm.indexType = $stateParams.sendData.indexType;
                }
                if ($stateParams.sendData.indexName) {
                    vm.indexName = $stateParams.sendData.indexName;
                }
                vm.sendDate = $stateParams.sendData.time;
                vm.timeType = $stateParams.sendData.timeType;
                switch (vm.timeType) {
                    case 'month':
                        vm.currentDate = moment(vm.sendDate).format('YYYY年MM月');
                        break;
                    case 'year':
                        vm.currentDate = moment(vm.sendDate).format('YYYY年');
                        break;
                    default:
                        break;
                }
            }
            var startYear = moment(vm.sendDate).subtract(4, "years").year();
            var endYear = moment(vm.sendDate).year();
            var endMonth = moment(vm.sendDate).month() + 1;
            fiveYearList = [];
            monthList = [];
            for (var i = startYear; i <= endYear; i++) {
                fiveYearList.push(i);
            }
            for (var i = 1; i <= endMonth; i++) {
                monthList.push(i);
            }
            initEChartsOptions();
        }
        /**
         * 初始化Echarts图的各种参数
         */
        function initEChartsOptions(){
            vm.chartsOption = {
                title: {
                    text: '万元产值单耗趋势',
                    subtext: '单位：吨标准煤/万元',
                    textStyle:{
                        fontSize: 15,
                        fontWeight: 'bolder',
                        color: '#333'
                    },
                    subtextStyle:{
                        fontSize: 10,
                        color: '#aaa'
                    }  
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
                    left: '20%'
                },
                legend: {
                    right: 'right',
                    data: ['本期']
                },
                xAxis: [
                    {
                        type: 'category',
                        data: [],
                        axisPointer: {
                            type: 'shadow'
                        }
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        // name: '单位：万吨标准煤/万元',
                        // axisLabel: {
                        //     formatter: function (v) {
                        //         if (v) {
                        //             return (v/10000) + '万';
                        //         } else {
                        //             return (v) + '万';
                        //         }
                        //     }
                        // }
                    }
                ],
                series: [
                    {
                        name: '本期',
                        type: 'bar',
                        barWidth: '50%',
                        itemStyle: {
                            //通常情况下：
                            normal: {
                                color: '#5D9CEC'
                            }
                        },
                        data: []
                    }
                ]
            };
            // var seriesBQData = [];
            // var seriesTQData = [];
            if (vm.timeType == 'month') {
                // for(var x in monthList){
                //     seriesBQData[x] = 0;
                //     seriesTQData[x] = 0;
                // }
                var seriesChiObj = {
                    name: '同期',
                    type: 'line',
                    itemStyle: {
                        //通常情况下：
                        normal: {
                            color: '#FF6600'
                        }
                    },
                    data: []
                };
                vm.chartsOption.xAxis[0].data = monthList;
                vm.chartsOption.series[1] = seriesChiObj;
                vm.chartsOption.legend.data[1] = '同期';
                // vm.chartsOption.series[0].data = seriesBQData;
                // vm.chartsOption.series[1].data = seriesTQData;
            }else if(vm.timeType == 'year'){
                // for(var x in fiveYearList){
                //     seriesBQData[x] = 0;
                // }
                vm.chartsOption.xAxis[0].data = fiveYearList;
                // vm.chartsOption.series[0].data = seriesBQData;
            }
        }

        /**
         * 获取数据
         */
        function getPageData() {
            $rootScope.showLoadingDialog();
            consumptionService.getData(vm.indexId, vm.indexType, vm.timeType, vm.sendDate).then(function (datas) {
                $rootScope.hideLoadingDialog();
                console.log(datas);
                datas = JSON.parse(datas);
                if (datas.failed) {
                    $ionicPopup.alert({
                        title: '提示',
                        template: datas.msg
                    })
                } else {
                    if (datas.energyConsumptionValue) {
                        vm.energyConsumptionValue = $rootScope.filterNumber(datas.energyConsumptionValue, 2);
                    }
                    vm.powerConsumptionValue = $rootScope.filterNumber(datas.powerConsumptionValue, 2);
                    vm.energyConsumptionValueYOY = $rootScope.filterNumber(datas.energyConsumptionValueYOY, 2);
                    vm.energyConsumptionValueLRR = $rootScope.filterNumber(datas.energyConsumptionValueLRR, 2);
                    buildEChartsOptions(datas.dataList);
                }
            });
        }

        /**
         * 初始化ECharts 各种参数
         * @param  data 
         */
        function buildEChartsOptions(data) {
            vm.chartsOption.series[0].data = [];
            if (vm.timeType == 'month') {
                if (data) {
                    var currentDataLength = monthList.length;
                    var lastYearseriesDataLength = monthList.length;
                    var currentData = new Array(currentDataLength);
                    var lastYearseriesData = new Array(lastYearseriesData);
                    for (var x in monthList) {
                        for (var i in data) {
                            if (data[i].month == monthList[x]) {
                                var wanCurrentData = $rootScope.filterNumber(data[i].value, 2);
                                var wanLastYearData = $rootScope.filterNumber(data[i].lastYearValue, 2);
                                currentData[x] = wanCurrentData;
                                lastYearseriesData[x] = wanLastYearData;
                                break;
                            } else {
                                var wanCurrentData = 0.00;
                                var wanLastYearData = 0.00;
                                currentData[x] = wanCurrentData;
                                lastYearseriesData[x] = wanLastYearData;
                            }
                        }
                    }
                    vm.chartsOption.series[0].data = currentData;
                    vm.chartsOption.series[1].data = lastYearseriesData;
                    // console.log(JSON.stringify(vm.chartsOption));
                }
            } else if (vm.timeType == 'year') {
                if (data) {
                    var currentData = new Array(5);
                    //由于服务器返回的数据可能缺少了某年，所以我们要遍历一下缺少娜年，给这年的数据赋值为0
                    for (var x in fiveYearList) {
                        for (var i in data) {
                            if (data[i].Year == fiveYearList[x]) {
                                var wanCurrentData = $rootScope.filterNumber(data[i].value, 2);
                                currentData[x] = wanCurrentData;
                                break;
                            } else {
                                var wanCurrentData = 0.00;
                                currentData[x] = wanCurrentData;
                            }
                        }
                    }
                    vm.chartsOption.series[0].data = currentData;
                    // console.log(JSON.stringify(vm.chartsOption));
                }
            }
        }

        function doRefresh() {
            getPageData();
            $scope.$broadcast('scroll.refreshComplete')
        }

    }

})();
