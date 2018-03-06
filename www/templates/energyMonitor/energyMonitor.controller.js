(function () {
  'use strict'
  angular.module('app.energyMonitor').controller('energyMonitorController', energyMonitorController)
  energyMonitorController.$inject = ['$rootScope', '$scope', 'energyMonitorService', '$ionicPopup', '$ionicLoading', '$location', '$stateParams', '$state', '$timeout']
  /** @ngInject */
  function energyMonitorController($rootScope, $scope, energyMonitorService, $ionicPopup, $ionicLoading, $location, $stateParams, $state, $timeout) {
    var vm = this;
    vm.enterpriseId = 'D5B84DB4-D2A6-42A0-BBCA-32B623A7C00D';
    vm.enterpriseName = '中车齐齐哈尔车辆有限公司';
    vm.energyId = 'power';
    vm.currentDate = moment().format('YYYY年MM月DD日 HH:mm');
    vm.maxValue = '-';
    vm.minValue = '-';
    vm.averageValue = '-';
    vm.indexName = '电力';
    vm.indexUnit = '万千瓦时';
    vm.indexUnitSymbol = 'wkwh';
    vm.chartGlobalConfig = {
      theme: 'shine',
      dataLoaded: true
    };
    vm.indexList = [{
      'indexId': 'power',
      'IndexName': '电力',
      'indexUnitName': '万千瓦时',
      'indexUnitSymbol': 'wkwh'
    },
    {
      'indexId': 'coal',
      'IndexName': '原煤',
      'indexUnitName': '万吨',
      'indexUnitSymbol': 'wt'
    },
    {
      'indexId': 'water',
      'IndexName': '水',
      'indexUnitName': '万立方米',
      'indexUnitSymbol': 'wm'
    }
    ];
    vm.tableDataList = [];
    vm.eChartsData = {};
    vm.legendArray = [];
    vm.fun = {
      indexChange: indexChange,
      query: query,
      doRefresh: doRefresh
    };
    //////
    activate()

    function activate() {
      $scope.$on('$ionicView.beforeEnter', function (event, view) {
        initPageData();
        getPageData();
      });
    }

    /**
     * 初始化页面的相关数据
     */
    function initPageData() {
      if ($stateParams.enterpriseId) {
        vm.enterpriseId = $stateParams.enterpriseId;
      }
      if ($stateParams.enterpriseName) {
        vm.enterpriseName = $stateParams.enterpriseName;
      }
      // console.log(vm.enterpriseId + '/' + vm.enterpriseName);
    }

    //获取页面数据
    function getPageData() {
      $rootScope.showLoadingDialog();
      var sendDate = moment().format('YYYY-MM-DD');
      energyMonitorService.getData(vm.enterpriseId, vm.energyId, sendDate).then(function (data) {
        $rootScope.hideLoadingDialog();
        if (data) {
          data = JSON.parse(data);
          if (data.failed) {
            $ionicPopup.alert({
              title: '提示',
              template: data.msg
            })
            vm.eChartsData = buildEChartsOptions({});
          } else {
            vm.maxValue = $rootScope.filterNumber(data.maxValue / 10000, 2);
            vm.minValue = $rootScope.filterNumber(data.minlValue / 10000, 2);
            vm.averageValue = $rootScope.filterNumber(data.averageValue / 10000, 2);
            vm.eChartsData = buildEChartsOptions(data);
            vm.tableDataList = sortAndBuildDataList(data.dataList);
          }
        }
      });
    }
    /**
     * 下拉刷新
     */
    function doRefresh() {
      getPageData();
      $scope.$broadcast('scroll.refreshComplete')
    }
    /**
     * 初始化ECharts 各种参数
     * @param  data 
     */
    function buildEChartsOptions(data) {
      if (data) {
        var xAxisData = [];
        var seriesData = [];
        for (var i in data.dataList) {
          xAxisData.push(data.dataList[i].time);
          var value = $rootScope.filterNumber(data.dataList[i].value/10000,2) ;
          seriesData.push(value);
        }
        var eChartsData = {
          title: {
            subtext: '单位：' + vm.indexUnit || ''
          },
          tooltip: {
            trigger: 'axis'
          },
          grid: {
            left: '15%'
          },
          legend: {
            data: vm.legendArray
          },
          toolbox: {
            show: true,
            feature: {
              magicType: {
                show: true,
                type: ['line', 'bar']
              }
            }
          },
          calculable: true,
          xAxis: [{
            type: 'category',
            data: xAxisData
          }],
          yAxis: [{
            type: 'value'
          }],
          series: [{
            name: vm.indexName,
            type: 'bar',
            data: seriesData
          }],
          itemStyle: {
            'normal': {
              'color': '#20aee5'
            }
          }
        }
      }
      return eChartsData;
    }

    /**
     * 点击tab切换指标
     */
    function indexChange(indexId) {
      $rootScope.showLoadingDialog();
      vm.energyId = indexId;
      // console.log(vm.energyId);
      for (var x in vm.indexList) {
        if (indexId == vm.indexList[x].indexId) {
          vm.indexName = vm.indexList[x].IndexName;
          vm.indexUnit = vm.indexList[x].indexUnitName;
          vm.indexUnitSymbol = vm.indexList[x].indexUnitSymbol;
        }
      }
      var sendDate = moment().format('YYYY-MM-DD');
      energyMonitorService.getData(vm.enterpriseId, vm.energyId, sendDate).then(function (data) {
        $rootScope.hideLoadingDialog();
        if (data) {
          // console.log(data);
          data = JSON.parse(data);
          if (data.failed) {
            $ionicPopup.alert({
              title: '提示',
              template: data.msg
            })
            vm.maxValue = '-';
            vm.minValue = '-';
            vm.averageValue = '-';
            vm.eChartsData = buildEChartsOptions({});
            vm.tableDataList = [];
          } else {
            vm.maxValue = $rootScope.filterNumber(data.maxValue / 10000, 2);
            vm.minValue = $rootScope.filterNumber(data.minlValue / 10000, 2);
            vm.averageValue = $rootScope.filterNumber(data.averageValue / 10000, 2);
            vm.eChartsData = buildEChartsOptions(data);
            vm.tableDataList = sortAndBuildDataList(data.dataList);
          }
        }
      });
    }
    /**
     * 使用lodash按照时间倒序，然后做相应的数据处理
     */
    function sortAndBuildDataList(dataList) {
      var data = _.sortBy(dataList, function (item) {
        return -item.time;
      })
      for (var x in data) {
        data[x].time = data[x].time + ':00';
        data[x].value = $rootScope.filterNumber(data[x].value / 10000, 2);
      }
      return data;
    }

    function query() {

    }

  }
})();

