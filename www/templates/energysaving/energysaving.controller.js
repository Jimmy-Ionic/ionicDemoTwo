(function () {
    'use strict';

    angular
        .module('app.energysaving')
        .controller('energysavingController', energysavingController);

    energysavingController.$inject = ['$rootScope', '$scope', 'energysavingService', '$timeout', '$state', '$ionicPopup'];
    /** @ngInject */
    function energysavingController($rootScope, $scope, energysavingService, $timeout, $state,  $ionicPopup) {
        var vm = this;
        var isYear = 0;//0：本年，1：五年计划
        var charge = 0;
        var isShowErrorPop = false;
        var errorInfo = '';
        var reqNum = 0;
        vm.fiveYearTitle = '';
        vm.dChartThisYear = {};
        vm.dChartFiveYear = {};
        vm.zzt = {};
        vm.chartGlobalConfig = {
            theme: 'shine',
            dataLoaded: true
        };
        vm.fun = {
            tab: tab,
            slideChanged: slideChanged,
            toESA: toESA,
            toAnalyse: toAnalyse
        }
        ////////////
        activate();
        ////////////
        function activate() {
            initPageData();
            getPageData(); 
        }
        /**
         * 初始化页面需要的各种数据
         */
        function initPageData() {
            vm.fiveYearTitle = chargeYear();
            // vm.dChartThisYear = initChartOption(0);
            // vm.dChartFiveYear = initChartOption(1);
        }
        /**
         * 访问服务器获取页面需要展示的数据 
         */
        function getPageData() {
            reqNum = 0;
            errorInfo = '';
            isShowErrorPop = false;
            getEchartsDatas(isYear);
            getRegionDatas();
        }
        /**
         * 查看当前年是哪个五年计划 
         */
        function chargeYear() {
            var now = new Date();
            var year = now.getFullYear();
            var title = '';
            // var the13thFiveStartYear = 2016;
            // var the13thFiveEndYear = 2020;
            // var chnNumChar = ["一","二","三","四","五","六","七","八","九"];
            // for(var i = 0; i < 20; i++){
            //     if (year >= the13thFiveStartYear + 5 * i && year <= the13thFiveEndYear + 5 * i) {
            //         var index = 13+i;
            //         text =  +  + '五节能量完成情况';
            //         break;
            //     }
            // }
            if (year >= 2016 && year <= 2020) {
                title = '十三五节能量完成情况';
            } else if (year >= 2021 && year <= 2025) {
                title = '十四五节能量完成情况';
            } else if (year >= 2026 && year <= 2030) {
                title = '十五五节能量完成情况';
            } else if (year >= 2031 && year <= 2035) {
                title = '十六五节能量完成情况';
            } else if (year >= 2036 && year <= 2040) {
                title = '十七五节能量完成情况';
            } else if (year >= 2041 && year <= 2045) {
                title = '十八五节能量完成情况';
            } else if (year >= 2046 && year <= 2050) {
                title = '十九五节能量完成情况';
            } else if (year >= 2051 && year <= 2055) {
                title = '二十五节能量完成情况';
            } else if (year >= 2056 && year <= 2060) {
                title = '二十一五节能量完成情况';
            }
            return title;
        }
        /**
         * 点击Tab切换
         * @param parm 
         */
        function tab(parm) {
            isYear = parm;
            if (parm == 0) {
                document.getElementById('thisYear').className = 'tab-item active';
                document.getElementById('fiveYear').className = 'tab-item';
            }
            else if (parm == 1) {
                document.getElementById('thisYear').className = 'tab-item';
                document.getElementById('fiveYear').className = 'tab-item active';
            }
            getPageData(isYear);
        };
        /**
         * 左右滑动切换页面
         * @param parm 
         */
        function slideChanged(parm) {
            tab(parm);
        }
        /**
         * 获取Echarts图的数据
         * @param isFive 
         */
        function getEchartsDatas(isYear) {
            $rootScope.showLoadingDialog();
            energysavingService.getDatas(isYear).then(function (datas) {
                console.log(datas);
                datas = JSON.parse(datas);
                if (datas.failed) {
                    setErrorInfo(true, datas.msg);
                } else {
                    vm.dChartThisYear = buildChartOption(isYear, true, datas);
                    vm.dChartFiveYear = buildChartOption(isYear, false, datas);
                }
                showErrorPopAndHideDialog();
            });
        }
        /**
         * 获取节能量完成预警的企业
         * @param isFive 
         */
        function getRegionDatas(isFive) {
            energysavingService.getDatasRegion(isFive).then(function (datas) {
                console.log(datas);
                datas = JSON.parse(datas);
                if (datas.failed) {
                    setErrorInfo(true, datas.msg);
                } else {
                    var result = datas.Table;
                    var list = [];
                    for (var i = 0; i < result.length; i++) {
                        var id = '';
                        var name = result[i].region_name;
                        if (isFive) {
                            id = name + ',' + '1' + ',' + result[i].region_id;
                        } else {
                            id = name + ',' + '0' + ',' + result[i].region_id;
                        }
                        var percent = result[i].ratio + '%';
                        var img = '';
                        if (result[i].alarm == 'true') {
                            img = 'img/alarming.png'
                        } else {
                            img = 'img/blank.png'
                        }
                        var data = {
                            id: id,
                            name: name,
                            percent: percent,
                            img: img
                        }
                        list.push(data);
                    }
                }
                vm.listData = list;
                console.log(vm.listData);
                showErrorPopAndHideDialog();
            });
        }
        /**
         * 初始化Echarts图的数据
         */
        function initChartOption(isYear) {
            var option = {};
            var color = [];
            var valueLittle = '-';
            var valueTotal = '-';
            var title = '-%';
            var titleColor = '';
            var subText = '';
            var seriesDataName = [];
            switch (isYear) {
                case 0:
                    color = ['#8e98ba', '#cfd7da'];
                    titleColor = '#374b7b';
                    break;
                case 1:
                    color = ['#2ec3c9', '#b2e5e1'];
                    titleColor = '#0b6665'
                    break;
                default:
                    break;
            }
            if (charge == 0) {
                subText = '累计完成节能量\n';
                charge++;
            } else {
                subText = '应完成节能量\n';
                charge = 0
            }
            option = {
                legend: { show: false },
                backgroundColor: '#ffffff',
                title: {
                    text: title,
                    subtext: subText + valueLittle,
                    // left: 'center',
                    x: 'center',
                    y: '25%',
                    textStyle: {
                        color: titleColor,
                        fontSize: '30'
                    },
                    subtextStyle: {
                        color: '#4d4d4d',
                        fontSize: '15'
                    }
                },
                series: [
                    {
                        name: '访问来源',
                        type: 'pie',
                        radius: ['85%', '100%'],
                        center: ['50%', '50%'],
                        label: {
                            normal: { show: false },
                        },
                        data: [
                            { value: valueLittle, name: '' },
                            { value: valueTotal, name: '' }
                        ],
                    }
                ],
                color: color
            };
            return option;
        }
        /**
         * 跳转到ESA页面
         */
        function toESA(id) {
            console.log(id);
            $state.go('ESA', { parm: id });
        }
        /**
         * 处理Echarts图需要的相关的数据
         * @param {*} isYear 
         * @param {*} thisYear 
         * @param {*} datas 
         */
        function buildChartOption(isYear, thisYear, datas) {
            var option = {};
            var color = [];
            var result = datas.Table[0];
            var completedEnergysaving = $rootScope.filterNumber(result.completed_energysaving, 2);
            var completedRatio = $rootScope.filterNumber(result.completed_ratio, 2) + '%';
            var taskEnergysaving = $rootScope.filterNumber(result.taske_energysaving, 2);
            var taskRatio = $rootScope.filterNumber(result.task_ratio, 2) + '%';
            var targetEnergysaving = $rootScope.filterNumber(result.target_energysaving, 2);
            if (completedEnergysaving > targetEnergysaving) {
                completedEnergysaving = targetEnergysaving;
            }
            var valueLittle = 0;
            var valueTotal = 0;
            var title = '';
            var titleColor = '';
            var subText = '';
            if (thisYear) {
                color = ['#8e98ba', '#cfd7da'];
                valueLittle = completedEnergysaving;
                valueTotal = targetEnergysaving - completedEnergysaving;
                title = completedRatio;
                titleColor = '#374b7b';
            } else {
                color = ['#2ec3c9', '#b2e5e1'];
                valueLittle = taskEnergysaving;
                valueTotal = targetEnergysaving - taskEnergysaving;
                title = taskRatio;
                titleColor = '#0b6665'
            }
            if (charge == 0) {
                subText = '累计完成节能量\n';
                charge++;
            } else {
                subText = '应完成节能量\n';
                charge = 0
            }
            option = {
                legend: { show: false },
                backgroundColor: '#ffffff',
                title: {
                    text: title,
                    subtext: subText + valueLittle,
                    // left: 'center',
                    x: 'center',
                    y: '25%',
                    textStyle: {
                        color: titleColor,
                        fontSize: '30'
                    },
                    subtextStyle: {
                        color: '#4d4d4d',
                        fontSize: '15'
                    }
                },
                series: [
                    {
                        name: '访问来源',
                        type: 'pie',
                        radius: ['85%', '100%'],
                        center: ['50%', '50%'],
                        label: {
                            normal: { show: false },
                        },
                        data: [
                            { value: valueLittle, name: '' },
                            { value: valueTotal, name: '' }
                        ],
                    }
                ],
                color: color
            };
            return option;
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
            reqNum++;
            if (reqNum == 2) {
                $rootScope.hideLoadingDialog();
                if (isShowErrorPop) {
                    $ionicPopup.alert({
                        title: '提示',
                        template: errorInfo
                    });
                }
            }
        }
        /**
         * 跳转到分析页面
         */
        function toAnalyse() {
            $state.go('home.analyse');
        };
    }
})();
