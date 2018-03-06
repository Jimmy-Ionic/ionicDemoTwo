(function () {
  'use strict'
  angular.module('app.energyRank').controller('energyRankController', energyRankController)
  energyRankController.$inject = ['$rootScope', '$scope', 'energyRankService', '$ionicPopup', '$timeout', 'MonthPicker', '$stateParams', '$ionicLoading']
  /** @ngInject */
  function energyRankController($rootScope, $scope, energyRankService, $ionicPopup, $timeout, MonthPicker, $stateParams, $ionicLoading) {
    var vm = this;
    vm.indexId = 'TotalEnergyConsumption';
    vm.timeType = 'month';
    vm.indexName = '能源消费总量';
    $scope.dataList = [];
    vm.timeStamp = moment().unix();//获取时间戳
    vm.currentDate = moment().subtract(1, 'months').format('YYYY年MM月'); // 日期选择控件选择完时间以后显示
    vm.sentDate = moment().subtract(1, 'months').format('YYYY-MM-DD');
    vm.choose = 'area';
    vm.indexUnit = '万吨标准煤';
    vm.indexUnitSymbol = 'wtce';
    vm.areaTitleList = [{
      ranking: "排名",
      name: "区域",
      current: "本期值",
      an: "同比",
      trend: "趋势"
    }];
    vm.industryTitleList = [{
      ranking: "排名",
      name: "行业",
      current: "本期值",
      an: "同比",
      trend: "趋势"
    }];
    vm.enterpriseTitleList = [{
      ranking: "排名",
      name: "企业",
      current: "本期值",
      an: "同比",
      trend: "趋势"
    }];
    vm.totalValue = '-';
    vm.totalValueYOY = '-%';
    vm.totalValueLRR = '-%';
    vm.areaValueList = [];
    vm.industryValueList = [];
    vm.enterpriseValueList = [];
    ///
    vm.fun = {
      doRefresh: doRefresh,
      showName: showName,
      selectArea: selectArea,
      selectIndustry: selectIndustry,
      selectEnterprise: selectEnterprise
    };
    //////
    activate();

    function activate() {
      //ionic监听页面状态，实现页面缓存的局部刷新
      $scope.$on('$ionicView.beforeEnter', function (event, view) {
        initPageData();
      });
    }

    function selectArea() {
      vm.choose = 'area';
    }

    function selectIndustry() {
      vm.choose = 'industry';
    }

    function selectEnterprise() {
      vm.choose = 'enterprise';
    }

    /**
     * 下拉刷新
     */
    function doRefresh() {
      initPageData();
      $scope.$broadcast('scroll.refreshComplete');
    }
    /**
     * 由于一些企业名称太长显示不开，可以点击名称，弹出dialog
     */
    function showName(name,indexType){
      var ionicDialogData = {};
      switch(indexType){
        case 'area':
          ionicDialogData.title = '区域名称';
          ionicDialogData.template = name;
          break;
        case 'industry':
          ionicDialogData.title = '行业名称';
          ionicDialogData.template = name;
          break;
        case 'enterprise':
          ionicDialogData.title = '企业名称';
          ionicDialogData.template = name;
          break;
        default:
          ionicDialogData.title = '名称';
          ionicDialogData.template = '';
          break;      
      }
      $ionicPopup.alert(ionicDialogData).then(function () {
      });
    }
    /**
     * 初始化页面的数据
     */
    function initPageData() {
      $rootScope.showLoadingDialog();
      if ($stateParams.condition) {
        var receiveData = JSON.parse($stateParams.condition);
        switch (receiveData.timeType) {
          case 'month':
            vm.currentDate = moment(receiveData.time).format('YYYY年MM月');
            break;
          case 'year':
            vm.currentDate = moment(receiveData.time).format('YYYY年');
            break;
          default:
            break;
        }
        vm.sentDate = receiveData.time;
        vm.timeType = receiveData.timeType;
        vm.indexId = receiveData.indexId;
        vm.indexName = receiveData.IndexName;
        vm.indexUnit = receiveData.indexUnitName;
        vm.indexUnitSymbol = receiveData.indexUnitSymbol;
      }
      energyRankService.getData(vm.indexId, vm.timeType, vm.sentDate).then(function (datas) {
        $rootScope.hideLoadingDialog();
        console.log(datas);
        if (datas.failed) {
          $ionicPopup.alert({
            title: '提示',
            template: datas.msg
          })
        } else {
          vm.totalValue = datas.totalValue;
          vm.totalValueYOY = datas.totalValueYOY + '%';
          vm.totalValueLRR = datas.totalValueLRR + '%';
          vm.areaValueList = datas.areaValueList;
          vm.industryValueList = datas.industryValueList;
          vm.enterpriseValueList = datas.enterpriseValueList;
        }
      })
    }
  }

})();
