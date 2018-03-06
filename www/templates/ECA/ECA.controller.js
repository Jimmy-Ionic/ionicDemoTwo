(function () {
    'use strict';

    angular
        .module('app.ECA')
        .controller('ECAController', ECAController);

    ECAController.$inject = ['$rootScope', '$scope', '$ionicSlideBoxDelegate', '$stateParams', '$state', '$timeout', 'ECAService', '$ionicPopup'];
    /** @ngInject */
    function ECAController($rootScope, $scope, $ionicSlideBoxDelegate, $stateParams, $state, $timeout, ECAService, $ionicPopup) {
        var vm = this;
        var energyId = 0; //0:全部;1:电力;2:原煤;3:天然气
        var timeType = 0; //0:月;1:年
        var regionId = 'null';
        var tradeId = 'null';
        var time = moment().subtract(1, 'month').startOf('month').format("YYYY-MM-DD"); //日期
        // var time = '2017-12-01'; //日期
        var data;
        var scale = 1;
        var queryTopDataObj = {};
        var queryBottomDataObj = {};
        var query5YearAnd12MonthObj = {};
        var energyIndexList = {};
        var dChartData = {};
        var pChartData = {};
        var radius1 = 110 * scale;
        var radius2 = 90 * scale;
        var resizeNum1 = 100 * scale;
        var resizeNum2 = 14 * scale;
        var resizeNum3 = 25 * scale;
        var resizeNum4 = -75 * scale;
        var errorInfo = '';//用来控制多个http请求时的多个弹窗的控制
        var reqNum = 0;//用来控制多个http请求时的多个弹窗的控制
        var isShowErrorPop = false;
        var nnyxfl = '-';
        var nnyxfltb = '-';
        var echartsTitle = '本月累计能源消费总量\n\n\n万吨煤标\n';
        vm.dChart = {};
        vm.pChart = {};
        vm.city = '齐齐哈尔';
        vm.dChart = {};
        vm.pChart = {};
        vm.yearItem = [];
        vm.year = moment().subtract(1, 'month').year();
        vm.month = moment().subtract(1, 'month').startOf('month').format("MM");
        vm.tabConTop = 0; //能源消费量，能源消费结构的tab状态判断的变量。0:消费结构;1:消费量
        vm.tabConBottom = 0; //能源消费量，电力，原煤，天然气tab状态判断的变量。对应顺序：0,1,2,3
        vm.chartGlobalConfig = {
            theme: 'shine',
            dataLoaded: true
        };
        vm.fun = {
            swichTabTopIndex: swichTabTopIndex,
            swichTabBottomIndex: swichTabBottomIndex,
            refresh: refresh,
            toTradeAndRegionPage: toTradeAndRegionPage,
            slideChanged: slideChanged,
            isYear: isYear,
            isMonthAndEC: isMonthAndEC,
            yearChange: yearChange, //点击"年、月"按钮切换查询时间
            monthChange: monthChange, //点击"年、月"按钮切换查询时间
            monthSel: monthSel,
            changeTimeType: changeTimeType,
            show1: show1,
            show2: show2,
            tabXFL: tabXFL,
            toECHistoryPage: toECHistoryPage,
            showName: showName,
            toAnalyse: toAnalyse
        };
        ///////
        activate();

        function activate() {
            //ionic监听页面状态，实现页面缓存的局部刷新
            $scope.$on('$ionicView.beforeEnter', function (event, view) {
                initPageData();
                getPageData();
            });
        }
        ///////
        /**
         * 每次进入页面首先初始化页面所需的一些数据
         */
        function initPageData() {
            console.log($stateParams);
            vm.yearItem = yearItem();
            timeType = 0;
            vm.tabConTop = 0;
            vm.tabConBottom = 0;
            $ionicSlideBoxDelegate.slide(0);
            if ($stateParams.name) {
                vm.city = $stateParams.name;
            }
            energyIndexList = ECAService.getEnergyIndexList();
            ///
            vm.d1 = "-"; //年能源消费量
            vm.d2 = "-"; //年能源消费量同比
            vm.d3 = "-"; //年能源消费量预测
            vm.d4 = "-";
            vm.d5 = "-";
            vm.d6 = "-";
            vm.d7 = "-"; //月能源消费量
            vm.d8 = "-"; //月能源消费量同比
            vm.d9 = "-"; //月能源消费量环比
            vm.d10 = "-"; //月能源消费量预测
            ///
            vm.e1 = "-"; //用电量 当量
            vm.e2 = "-"; //用电量 折标量
            vm.e3 = "-"; //用气量 当量
            vm.e4 = "-"; //用气量 折标量
            vm.e5 = "-"; //用热量 当量
            vm.e6 = "-"; //用热量 折标量
            vm.e7 = "-"; //用油量 当量
            vm.e8 = "-"; //折标量 折标量
            vm.e9 = "-"; //用煤量 当量
            vm.e10 = "-"; //用煤量 折标量
            ///
            if ($stateParams.timeType) {
                timeType = parseInt($stateParams.timeType);
            }
            if ($stateParams.time) {
                time = $stateParams.time;
                var timeArray = $rootScope.splitStr(time, '-');
                vm.year = parseInt(timeArray[0]);
                vm.month = timeArray[1];
            }
            if ($stateParams.regionId && $stateParams.tradeId) {
                regionId = $stateParams.regionId;
                tradeId = $stateParams.tradeId;
                queryTopDataObj = {
                    timeType: timeType === 0 ? 'month' : 'year',
                    time: time,
                    regionId: regionId,
                    tradeId: tradeId,
                };
                queryBottomDataObj = {
                    energyId: energyIndexList.energyAll,
                    timeType: timeType === 0 ? 'month' : 'year',
                    time: time,
                    regionId: regionId,
                    tradeId: tradeId,
                };
                query5YearAnd12MonthObj = {
                    timeType: timeType === 0 ? 'month' : 'year',
                    time: time,
                    regionId: regionId,
                    tradeId: tradeId,
                }
            } else {
                queryTopDataObj = {
                    timeType: 'month',
                    time: time,
                    regionId: 'null',
                    tradeId: 'null'
                };
                queryBottomDataObj = {
                    energyId: energyIndexList.energyAll,
                    timeType: 'month',
                    time: time,
                    regionId: 'null',
                    tradeId: 'null',
                };
                query5YearAnd12MonthObj = {
                    timeType: 'month',
                    time: time,
                    regionId: 'null',
                    tradeId: 'null',
                }
            }
            switch (timeType) {
                case 0:
                    vm.timeName = '月';
                    break;
                case 1:
                    vm.timeName = '年';
                    break;
                default:
                    vm.timeName = '月';
                    break;
            }
            console.log(vm.year);
            console.log(vm.yearItem);
        }
        /**
         * 获取页面中数据
         */
        function getPageData() {
            $rootScope.showLoadingDialog();
            reqNum = 0;
            errorInfo = '';
            isShowErrorPop = false;
            switch (timeType) {
                case 0:
                    getECAEchartsData(queryTopDataObj);
                    getECABottomData(queryBottomDataObj, false);
                    break;
                case 1:
                    getECAEchartsData(queryTopDataObj, queryBottomDataObj);
                    getECABottomData(queryBottomDataObj, false);
                    getECSAYearAndMonth(query5YearAnd12MonthObj);
                    break;
                default:
                    break;
            }
        };
        /**
         * 获取页面Echarts饼状图的数据
         * @param queryObj 
         */
        function getECAEchartsData(queryTopDataObj, queryBottomDataObj) {
            ECAService.getECAEchartsData(queryTopDataObj)
                .then(function (datas) {
                    datas = JSON.parse(datas);
                    if (datas.failed) {
                        vm.dChart = {};
                        vm.e1 = "-"; //用电量 当量
                        vm.e2 = "-"; //用电量 折标量
                        vm.e3 = "-"; //用气量 当量
                        vm.e4 = "-"; //用气量 折标量
                        vm.e5 = "-"; //用热量 当量
                        vm.e6 = "-"; //用热量 折标量
                        vm.e7 = "-"; //用油量 当量
                        vm.e8 = "-"; //折标量 折标量
                        vm.e9 = "-"; //用煤量 当量
                        vm.e10 = "-"; //用煤量 折标量
                        setErrorInfo(true, datas.msg);
                    } else {
                        var dArray = [];
                        var dObject = {};
                        if (datas.data) {
                            for (var i = 0; i < datas.data.length; i++) {
                                dObject = {
                                    name: "",
                                    value: "",
                                };
                                if (datas.data[i].energyname) {
                                    dObject.name = datas.data[i].energyname;
                                } else {
                                    dObject.name = '-';
                                }
                                if (datas.data[i].TotalCons_zbl_cm) {
                                    dObject.value = $rootScope.filterNumber(datas.data[i].TotalCons_zbl_cm, 2);
                                } else {
                                    dObject.value = 0;
                                }
                                dArray.push(dObject);
                                if (timeType == 0) {
                                    if (datas.data[i].energyid == energyIndexList.power) {
                                        vm.e1 = $rootScope.filterNumber(datas.data[i].TotalCons_swl_cm, 2);
                                        vm.e2 = $rootScope.filterNumber(datas.data[i].TotalCons_zbl_cm, 2);
                                    } else if (datas.data[i].energyid == energyIndexList.naturalGas) {
                                        vm.e3 = $rootScope.filterNumber(datas.data[i].TotalCons_swl_cm, 2);
                                        vm.e4 = $rootScope.filterNumber(datas.data[i].TotalCons_zbl_cm, 2);
                                    } else if (datas.data[i].energyid == energyIndexList.heat) {
                                        vm.e5 = $rootScope.filterNumber(datas.data[i].TotalCons_swl_cm, 2);
                                        vm.e6 = $rootScope.filterNumber(datas.data[i].TotalCons_zbl_cm, 2);
                                    } else if (datas.data[i].energyid == energyIndexList.oil) {
                                        vm.e7 = $rootScope.filterNumber(datas.data[i].TotalCons_swl_cm, 2);
                                        vm.e8 = $rootScope.filterNumber(datas.data[i].TotalCons_zbl_cmlj, 2);
                                    } else if (datas.data[i].energyid == energyIndexList.coal) {
                                        vm.e9 = $rootScope.filterNumber(datas.data[i].TotalCons_swl_cm, 2);
                                        vm.e10 = $rootScope.filterNumber(datas.data[i].TotalCons_zbl_cm, 2);
                                    }
                                }
                            }
                            if (datas.hb > 0 || datas.hb == 0) {
                                datas.hb = "+" + $rootScope.filterNumber(datas.hb, 2) + "%";
                            } else {
                                datas.hb = $rootScope.filterNumber(datas.hb, 2) + "%";
                            }
                            dChartData = {
                                data: dArray,
                                nyxhzl: $rootScope.filterNumber(datas.nyhj, 2),
                                nyxhzltb: datas.hb
                            }
                            vm.dChart = builddChartOptions();
                        } else {
                            dChartData = {
                                nyxhzltb: "-"
                            }
                            vm.dChart = builddChartOptions();
                        }
                    }
                    showErrorPopAndHideDialog();
                });
        };
        /**
         * 获取能源消费量、电力、原煤、天然气
         * @param queryBottomDataObj 
         */
        function getECABottomData(queryBottomDataObj, single) {
            ECAService.getECABottomData(queryBottomDataObj)
                .then(function (datas) {
                    $rootScope.hideLoadingDialog();
                    console.log('Bottom-Data' + datas);
                    datas = JSON.parse(datas);
                    if (datas.failed) {
                        if (timeType == 0) {
                            vm.d7 = '-';
                            vm.d8 = '-';
                            vm.d9 = '-';
                            vm.d10 = '-';
                        } else if (timeType == 1) {
                            vm.d1 = '-';
                            vm.d2 = '-';
                            vm.d3 = '-';
                        }
                        if (single) {
                            $rootScope.showAlert(datas.msg);
                        } else {
                            setErrorInfo(true, datas.msg);
                        }
                    } else {
                        if (timeType == 0) {
                            vm.d7 = $rootScope.filterNumber(datas.Table[0].nyxhzbl, 2);
                            vm.d8 = $rootScope.filterNumber(datas.Table[0].tb, 2);
                            vm.d9 = $rootScope.filterNumber(datas.Table[0].hb, 2);
                            vm.d10 = $rootScope.filterNumber(datas.Table[0].ycl, 2);
                        } else if (timeType == 1) {
                            if(queryBottomDataObj.energyId == energyIndexList.energyAll){
                                nnyxfl = $rootScope.filterNumber(datas.Table[0].nyxhzbl, 2);
                                nnyxfltb = $rootScope.filterNumber(datas.Table[0].tb, 2);
                            }
                            vm.d1 = $rootScope.filterNumber(datas.Table[0].nyxhzbl, 2);
                            vm.d2 = $rootScope.filterNumber(datas.Table[0].tb, 2);
                            vm.d3 = $rootScope.filterNumber(datas.Table[0].ycl, 2);
                        }
                    }
                    if (single) {

                    } else {
                        showErrorPopAndHideDialog();
                    }
                });
        };
        /**
         * 查询最近5年还有本年度12个月的能源消费总量的数据
         * @param query5YearAnd12MonthObj 
         */
        function getECSAYearAndMonth(query5YearAnd12MonthObj) {
            ECAService.getECSAYearAndMonth(query5YearAnd12MonthObj)
                .then(function (datas) {
                    $rootScope.hideLoadingDialog();
                    console.log(datas);
                    datas = JSON.parse(datas);
                    if (datas.failed) {
                        setErrorInfo(true, datas.msg);
                        vm.pChart = {};
                    } else {
                        ///处理能源消费量Tab相关的数据
                        var pArray = [];
                        var pObject = {};
                        for (var i = 0; i < datas.dataMonth.length; i++) {
                            pObject = {
                                name: '',
                                value: ''
                            };
                            if (datas.dataMonth[i]) {
                                var dateStrArray = $rootScope.splitStr(datas.dataMonth[i].date, '/');
                                if (dateStrArray) {
                                    pObject.name = dateStrArray[1] + '月';
                                } else {
                                    pObject.name = '-'
                                }
                            } else {
                                pObject.name = '';
                            }
                            if (datas.dataMonth[i].bqdata) {
                                pObject.value = $rootScope.filterNumber(datas.dataMonth[i].bqdata, 2);
                            } else {
                                pObject.value = 0;
                            }
                            pArray.push(pObject);
                        }
                        pChartData = {
                            data: pArray
                        };
                        vm.pChart = buildpChartOptions();
                    }
                    showErrorPopAndHideDialog();
                });
        }
        /**
         * 点击Tab切换能源消费量、电力、原煤、天然气的数据
         * @param index 
         */
        function swichTabBottomIndex(index) {
            if (index == 0) {
                vm.tabConBottom = 0;
                queryBottomDataObj.energyId = energyIndexList.energyAll;
            } else if (index == 1) {
                vm.tabConBottom = 1;
                queryBottomDataObj.energyId = energyIndexList.power;
            } else if (index == 2) {
                vm.tabConBottom = 2;
                queryBottomDataObj.energyId = energyIndexList.coal;
            } else if (index == 3) {
                vm.tabConBottom = 3;
                queryBottomDataObj.energyId = energyIndexList.naturalGas;
            }
            getECABottomData(queryBottomDataObj, true);
        };
        /**
         * 点击Tab切换能源消费结构，能源消费量
         * @param index 
         */
        function swichTabTopIndex(index) {
            vm.tabConTop = index;
            if (index == 0) {
                $ionicSlideBoxDelegate.slide(index);
            } else if (index == 1) {
                $ionicSlideBoxDelegate.slide(index);
                resizeChart('pChart');
            }
        };
        /**
         * 由于一些行业名称太长显示不开，可以点击名称，弹出dialog
         */
        function showName() {
            var ionicDialogData = {};
            ionicDialogData.title = '名称';
            ionicDialogData.template = vm.city;
            $ionicPopup.alert(ionicDialogData).then(function () { });
        }
        /**
         * 左右滑动切换页面
         * @param index 
         */
        function slideChanged(index) {
            swichTabTopIndex(index);
        };

        /**
         * 组装能源消费结构的Echarts数据
         */
        function builddChartOptions() {
            switch(timeType){
                case 0:
                    echartsTitle = '本月累计能源消费总量\n\n\n万吨煤标\n';
                    break;
                case 1:
                    echartsTitle = '全年累计能源消费总量\n\n\n万吨煤标\n';
                    break;
                default:
                    break;        
            }
            var dataOption = {
                animation: true,
                title: {
                    show: true,
                    text: echartsTitle + '同比：' + dChartData.nyxhzltb,
                    subtext: dChartData.nyxhzl,
                    /*subtext:123124,*/
                    x: 'center',
                    y: 'center',
                    //正标题样式
                    textStyle: {
                        fontSize: resizeNum2,
                        fontFamily: 'Arial',
                        fontWeight: 200,
                        //color:'#1a4eb0',
                    },
                    //副标题样式
                    subtextStyle: {
                        fontSize: resizeNum3,
                        fontFamily: 'Arial',
                        color: "#1a4eb0"
                    },
                    itemGap: resizeNum4
                },
                tooltip: {
                    trigger: 'item',
                    formatter: "{b} : {c}"
                },
                color: ['#97b653', '#94726e', '#dd6aaa', '#2ac8c2', '#ffb980', '#d87b7f', '#8c99b2', '#e3d00d'],
                series: [{
                    name: '全年累计能源消费总量',
                    type: 'pie',
                    center: ['50%', '50%'], //圆心坐标（div中的%比例）
                    radius: [radius2, radius1], //半径
                    x: '0%', // for funnel
                    data: dChartData.data,
                    labelLine: {
                        normal: {
                            show: true,
                            length: 6,
                            length2: 2,
                            smooth: true
                        }
                    },
                    startAngle: 335
                }]
            };
            return dataOption;
        };
        /**
         * 组装能源消费量的Echarts的数据 
         */
        function buildpChartOptions() {
            var dataOption = {
                animation: true,
                tooltip: {
                    trigger: 'item',
                    formatter: "{b}: {c}"
                },
                color: ['#97b653', '#94726e', '#dd6aaa', '#2ac8c2', '#ffb980', '#d87b7f', '#8c99b2', '#e3d00d'],
                series: [{
                    type: 'pie',
                    center: ['50%', '50%'],
                    radius: ['20%', '80%'],
                    roseType: 'area',
                    data: pChartData.data
                }]
            };
            return dataOption;
        };
        /**
         * 跳转到能源消耗分析历史查询页面
         * @param parm4 
         */
        function toECHistoryPage(index) {
            var time = ''; //组装时间，格式为xxxx-xx-xx
            switch (timeType) {
                case 0:
                    time = vm.year + '-' + vm.month + '-' + '01'
                    break;
                case 1:
                    time = vm.year + '-01-01';
                    break;
                default:
                    time = vm.year + '-' + vm.month + '-' + '01'
                    break;
            }
            var ecaSonData = {
                energyId: queryBottomDataObj.energyId, //能源Id
                energyXFL: nnyxfl, //能源消费量
                energyXFLTB: nnyxfltb, //能源消费量同比
                name: vm.city,
                timeType: timeType, //时间类型，0:monthyear
                time: time, //时间类型
                regionId: regionId, //地区
                tradeId: tradeId, //行业
            }
            $state.go('ECAson', {
                ecaSonData: ecaSonData
            });
        };
        /**
         * 跳转到tradeAndRegion页面（行业跟地区选择页面）
         */
        function toTradeAndRegionPage() {
            var toECAsonData = {
                path: 'ECA',
                name: vm.city,
                timeType: timeType,
                time: time,
                regionId: regionId,
                tradeId: tradeId
            };
            $state.go('tradeAndRegion', {
                datas: toECAsonData
            });
        };
        /**
         * 跳转到分析页面
         */
        function toAnalyse() {
            $state.go('home.analyse');
        };
        /**
         * 查询条件是年时显示的页面
         */
        function isYear() {
            if (timeType == 0) {
                return false;
            } else if (timeType == 1) {
                return true;
            }
        };

        /**
         * 查询月并且是能源消费量时，显示的页面。EC(energy Consumption)
         */
        function isMonthAndEC() {
            if (timeType == 0) {
                if (vm.tabConTop == 1) {
                    return true;
                }
                return false;
            } else if (timeType == 1) {
                return false;
            }
        };
        /**
         * 切换年月
         */
        function changeTimeType() {
            if (timeType == 1) {
                timeType = 0;
                vm.timeName = "月";
                vm.tabConBottom = 0;
                queryTopDataObj.timeType = "month";
                queryBottomDataObj.energyId = energyIndexList.energyAll;
                queryBottomDataObj.timeType = "month";
                query5YearAnd12MonthObj.timeType = "month";
                // time = document.getElementById('year').value.substr(7, 4) + '-' + document.getElementById('month').value + '-01';
                time = vm.year + '-' + vm.month + '-01';
                queryTopDataObj.time = time;
                queryBottomDataObj.time = time;
                query5YearAnd12MonthObj.time = time;
                getPageData();
            } else if (timeType == 0) {
                timeType = 1;
                vm.timeName = "年";
                vm.tabConBottom = 0;
                queryTopDataObj.timeType = "year";
                queryBottomDataObj.energyId = energyIndexList.energyAll;
                queryBottomDataObj.timeType = "year";
                query5YearAnd12MonthObj.timeType = "year";
                // time = document.getElementById('year').value.substr(7, 4) + '-01-01';
                time = vm.year + '-01-01';
                queryTopDataObj.time = time;
                queryBottomDataObj.time = time;
                query5YearAnd12MonthObj.time = time;
                getPageData();
            }
        };

        function monthSel() {
            if (timeType == 0) {
                return true;
            } else if (timeType == 1) {
                return false;
            }
        };
        /** 
         * 重新渲染Echarts 
         */
        function resizeChart() {
            $timeout(function () {
                var dChart = document.getElementById('dChart');
                var pChart = document.getElementById('pChart');
                echarts.getInstanceByDom(dChart).resize();
                echarts.getInstanceByDom(pChart).resize();
            });
        };

        /** 
         * 点击月份选择月，查询相关月份数据
         */
        function monthChange() {
            time = vm.year + '-' + vm.month + '-' + '01';
            queryTopDataObj.time = time;
            queryBottomDataObj.time = time;
            // query5YearAnd12MonthObj.time = time;//查询月数据时，不需要查询近5年的数据
            getPageData();
        };

        /** 
         * 点击年份选择年份 
         */
        function yearChange() {
            if (timeType == 0) {
                // time = document.getElementById('year').value.substr(7, 4) + '-' + document.getElementById('month').value + '-' + '01';
                time = vm.year + '-' + document.getElementById('month').value + '-' + '01';
            } else if (timeType == 1) {
                // time = document.getElementById('year').value.substr(7, 4) + '-01-01';
                time = vm.year + '-01-01';
            }
            queryTopDataObj.time = time;
            queryBottomDataObj.time = time;
            query5YearAnd12MonthObj.time = time;
            getPageData();
        };

        function show2() {
            if (timeType == 0) {
                return true;
            } else if (timeType == 1) {
                return false;
            }
        }

        function show1() {
            if (timeType == 1) {
                return true;
            } else if (timeType == 0) {
                return false;
            }
        };

        function dataValidate(parm6) {
            if (parm6) {
                return parm6;
            }
        }

        function yearItem() {
            var opt = [];
            var a = parseInt(moment().startOf('year').format('YYYY'));
            // var yearItem = {
            //     yearLabel: a,
            //     yearValue: a
            // };
            // for (var i = 0; i < 10; i++) {
            //     yearItem = {
            //         yearLabel: (a - i),
            //         yearValue: (a - i)
            //     };
            //     opt.push(yearItem);
            // }
            for (var i = 0; i < 10; i++) {
                opt.push(a - i);
            }
            // vm.year = moment().subtract(1, 'months').year();
            return opt;
        };

        /**
         * 处理查询Obj中的相关字段
         * @param param 
         */
        function buildQueryObj(param) {
            if ($stateParams.type == "region") {
                param.trade = '';
                if (!$stateParams.id) {
                    param.region = 'all';
                } else if ($stateParams.id) {
                    param.region = $stateParams.id
                }
            } else if ($stateParams.type == "trade") {
                param.region = '';
                if (!$stateParams.id) {
                    param.trade = 'all';
                } else if ($stateParams.id) {
                    param.trade = $stateParams.id;
                }
            }
        };
        /**
         * 下拉刷新数据 
         */
        function refresh() {
            getPageData();
            $scope.$broadcast('scroll.refreshComplete');
        }
        /**
     * 设置当获取数据错误的时候的提示窗口只有一个。
     * @param {*} parmOne 
     * @param {*} parmTwo 
     */
        function setErrorInfo(parmOne, parmTwo) {
            isShowErrorPop = parmOne;
            errorInfo = parmTwo;
        }
        /** 
         * 弹窗提示错误隐藏Dialog 
         */
        function showErrorPopAndHideDialog() {
            reqNum ++;
            console.log(reqNum);
            console.log(errorInfo);
            switch (timeType) {
                case 0:
                    if (reqNum == 2) {
                        $rootScope.hideLoadingDialog();
                        if (isShowErrorPop) {
                            $ionicPopup.alert({
                                title: '提示',
                                template: errorInfo
                            });
                        }
                    }
                    break;
                case 1:
                    if (reqNum == 3) {
                        $rootScope.hideLoadingDialog();
                        if (isShowErrorPop) {
                            $ionicPopup.alert({
                                title: '提示',
                                template: errorInfo
                            });
                        }
                    }
                    break;
                default:
                    break;
            }

        }
    }
})();

