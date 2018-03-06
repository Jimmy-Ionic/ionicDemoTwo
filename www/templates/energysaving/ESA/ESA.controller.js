(function () {
    'use strict';

    angular
        .module('app.ESA')
        .controller('ESAController', ESAController);

    ESAController.$inject = ['$rootScope', '$scope', '$ionicSlideBoxDelegate', '$state', '$stateParams', 'ESAService', '$timeout'];
    /** @ngInject */
    function ESAController($rootScope, $scope, $ionicSlideBoxDelegate, $state, $stateParams, ESAService, $timeout) {
        var vm = this;
        var parmList = [];
        var parms = '';
        vm.city = '';
        vm.pieChart = {};
        vm.companys = [];
        vm.chartGlobalConfig = {
            theme: 'shine',
            dataLoaded: true
        };
        ////////////
        activated();
        ////////////
        function activated() {
            initPageData();
            getPageData();
        }
        /**
         * 初始化页面的相关数据
         */
        function initPageData() {
            console.log($stateParams.parm);
            parmList = $stateParams.parm.split(',');
            vm.city = parmList[0];
            parms = buildParms(parmList);
        }
        /**
         * 访问后台获取页面需要展示的数据
         */
        function getPageData() {
            getESAData();
        }
        /**
         * 处理Echarts图所需要的相关的数据
         * @param datas 
         */
        function pieChartBuilder(datas) {
            var option = {
                animation: true,
                tooltip : {
                    trigger: 'item',
                    formatter: "{b}占比:{d}%"
                },
                color:['#c23432','#2f4455','#63a0a5','#d48365','#93c8ae'],
                // color: ['green'],
                series: [{
                    type: 'pie',
                    center: ['50%', '50%'],//圆心坐标（div中的%比例）
                    data: datas
                }]
            };
            return option;
        };
        /**
         * 处理相关的参数
         * @param parmlist 
         */
        function buildParms(parmlist) {
            var data = {
                year: moment().format("YYYY"),
                isFive: '',
                region: ''
            };
            if (parmlist[1] == 0) {
                data.isFive = false;
            } else {
                data.isFive = true;
            }
            if(parmlist[2]){
                data.region = parmList[2];
            }
            return data;
        };
        /**
         * 访问后台拿取数据
         */
        function getESAData() {
            $rootScope.showLoadingDialog();
            ESAService.getData(parms)
                .then(function (datas) {
                    $rootScope.hideLoadingDialog();
                    console.log(datas);
                    var data = JSON.parse(datas);
                    if (data.failed) {
                        $rootScope.showAlert(data.msg);
                    } else {
                        var chart = [{
                            name: '0%-20%',
                            value: 0
                        }, {
                            name: '20%-40%',
                            value: 0
                        }, {
                            name: '40%-60%',
                            value: 0
                        }, {
                            name: '60%-80%',
                            value: 0
                        }, {
                            name: '80%-100%',
                            value: 0
                        }];
                        chart[0].value = group(20, data);
                        chart[1].value = group(40, data);
                        chart[2].value = group(60, data);
                        chart[3].value = group(80, data);
                        chart[4].value = group(100, data);
                        vm.pieChart = pieChartBuilder(chart);
                        vm.companys = data.Table;
                    }
                });
        };

        function group(a, datas) {
            var flag = 0;
            for (var i = 0; i < datas.Table.length; i++) {
                if ((datas.Table[i].ratio < a || datas.Table[i].ratio == a) && datas.Table[i].ratio > (a - 20)) {
                    flag = flag + 1;
                }
            }
            return flag;
        };
    }
})();
