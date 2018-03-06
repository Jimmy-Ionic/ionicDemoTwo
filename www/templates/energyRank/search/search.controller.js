(function () {
  'use strict'
  angular.module('app.search').controller('searchController', searchController)
  searchController.$inject = ['$rootScope', '$scope', 'searchService', '$ionicPopup', '$timeout', '$ionicLoading', 'MonthPicker', '$stateParams', '$state', '$ionicHistory']
  /** @ngInject */
  function searchController($rootScope, $scope, searchService, $ionicPopup, $timeout, $ionicLoading, MonthPicker, $stateParams, $state, $ionicHistory) {
    var vm = this;
    var cssList = ['new-content', 'new-naviBar', 'new-button-back', 'new-tab-top', 'item1', 'new-title2', 'main-value', 'unit-medium', 'tab-not-active', 'text-title', 'new-titlebar-right-btn'];
    var resize_width = window.screen.width;
    var scale = resize_width / 640;
    var dateFormat = 'YYYY年MM月';
    vm.scalenum = scale;
    vm.timeType = 'month';
    vm.currentDate = '';
    vm.sendDate = moment().subtract(1, 'months').format('YYYY-MM-DD');
    // 需要返回到上一页面的数据Obj
    vm.selectObj = {
      indexId: "TotalEnergyConsumption",
      IndexName: "能源消费总量",
      indexUnitName: "万吨标准煤",
      indexUnitSymbol: "wtce",
      timeType: "month",
      time: vm.sendDate
    };
    //设置时间选择控件的格式
    vm.calenderInitObj = {
      minMonthIndex: 1,
      minYear: 1900,
      maxMonth: new Date().getMonth(),
      maxYear: 2100,
      startingYear: new Date().getFullYear(),
      monthLabels: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
      title: '选择时间',
      cancelText: '取消',
      cancelClass: 'button-assertive'
    };
    vm.indexList = [];
    ///
    vm.fun = {
      showcalender: showcalender,
      confirm: confirm
    };
    // 获取页面的数据
    initPageData();

    function resize() {
      for (var i = 0; i < cssList.length; i++) {
        var propr = document.getElementsByClassName(cssList[i])
        if (cssList[i] == 'new-content') {
          for (var j = 0; j < propr.length; j++) {
            propr[j].style.marginTop = window.getComputedStyle(propr[j]).marginTop.replace('px', '') * scale + 'px'
          }
        } else {
          for (var j = 0; j < propr.length; j++) {
            propr[j].style.height = window.getComputedStyle(propr[j]).height.replace('px', '') * scale + 'px'
            propr[j].style.fontSize = window.getComputedStyle(propr[j]).fontSize.replace('px', '') * scale + 'px'
            propr[j].style.lineHeight = window.getComputedStyle(propr[j]).lineHeight.replace('px', '') * scale + 'px'
            propr[j].style.paddingTop = window.getComputedStyle(propr[j]).paddingTop.replace('px', '') * scale + 'px'
            propr[j].style.paddingLeft = window.getComputedStyle(propr[j]).paddingLeft.replace('px', '') * scale + 'px'
            propr[j].style.paddingRight = window.getComputedStyle(propr[j]).paddingRight.replace('px', '') * scale + 'px'
            propr[j].style.paddingBottom = window.getComputedStyle(propr[j]).paddingBottom.replace('px', '') * scale + 'px'
            propr[j].style.marginTop = window.getComputedStyle(propr[j]).marginTop.replace('px', '') * scale + 'px'
            propr[j].style.marginBottom = window.getComputedStyle(propr[j]).marginBottom.replace('px', '') * scale + 'px'
            propr[j].style.marginLeft = window.getComputedStyle(propr[j]).marginLeft.replace('px', '') * scale + 'px'
            propr[j].style.marginRight = window.getComputedStyle(propr[j]).marginRight.replace('px', '') * scale + 'px'
          }
        }
      }
    }

    $timeout(function () {
      resize()
    })

    /**
     * 初始化界面中的各种数据
     */
    function initPageData() {
      $rootScope.showLoadingDialog();
      vm.currentDate = moment().subtract(1, 'months').format(dateFormat);
      MonthPicker.init(vm.calenderInitObj);
      searchService.getIndexList().then(handleEnergyRankingData);
    }

    /**
     * 能耗排名获取指标数据
     * @param datas 
     */
    function handleEnergyRankingData(datas) {
      console.log(datas);
      $rootScope.hideLoadingDialog();
      datas = JSON.parse(datas);
      if (datas.failed) {
        $ionicPopup.alert({
          title: '提示',
          template: datas.msg
        })
      } else {
        vm.indexList = datas.Table;
      }
    }

    /**
     * 显示日期控件
     */
    function showcalender() {
      MonthPicker.show(function (res) {
        if (res) {
          switch (res.condition) {
            case 'year':
              vm.currentDate = res.year + '年';
              vm.timeType = 'year';
              vm.sendDate = res.year + '-1-1';
              break;
            case 'month':
              vm.currentDate = res.year + '年' + (res.month + 1) + '月';
              vm.timeType = 'month';
              vm.sendDate = res.year + '-' + (res.month + 1) + '-1';
              break;
            default:
              break;
          }
        }
      })
    }

    /**
     * 点击确定要返回到上一页面，并且传递回数据
     */
    function confirm() {
      vm.selectObj.timeType = vm.timeType;
      vm.selectObj.time = vm.sendDate;
      var selectObjStr = JSON.stringify(vm.selectObj);
      $state.go('home.energyRank', { condition: selectObjStr });
    }
    
  }
})();
