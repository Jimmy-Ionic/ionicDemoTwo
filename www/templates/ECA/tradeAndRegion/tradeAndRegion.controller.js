(function () {
  'use strict';

  angular
    .module('app.tradeAndRegion')
    .controller('tradeAndRegionController', tradeAndRegionController);

  tradeAndRegionController.$inject = ['$rootScope', '$scope', '$ionicSlideBoxDelegate', '$state', '$stateParams', 'tradeAndRegionService', '$ionicPopup', '$timeout'];
  /** @ngInject */
  function tradeAndRegionController($rootScope, $scope, $ionicSlideBoxDelegate, $state, $stateParams, tradeAndRegionService, $ionicPopup, $timeout) {
    var vm = this;
    var parms = {};
    var pinYinData = {};
    var isShowErrorPop = false;
    var errorInfo = '';
    var reqNum = 0;
    var tabTime = 0;
    vm.pageIndex == 0;
    vm.showMatchingTrade = false;
    vm.matchingTradeList = [];
    vm.path = ''
    vm.keyTrade = [];
    vm.tradeList = [];
    vm.regionList = [];
    vm.fun = {
      tab: tab,
      slideChanged: slideChanged,
      choose: choose,
      search: search,
      goBack: goBack
    }
    //////
    activated();
    //////
    function activated() {
      $scope.$on('$ionicView.beforeEnter', function () {
        initPageData();
        getPageData();
      });
    }
    /**
     * 初始化页面数据的各项参数。
     */
    function initPageData() {
      tabTime = 0;
      vm.searchRegion = '';
      vm.searchTrade = '';
      vm.showMatchingTrade = false;
      console.log($stateParams.datas);
      if ($stateParams.datas) {
        vm.path = $stateParams.datas.path;
        parms.name = $stateParams.datas.name;
        parms.regionId = $stateParams.datas.regionId;
        parms.tradeId = $stateParams.datas.tradeId;
        parms.timeType = $stateParams.datas.timeType;
        parms.time = $stateParams.datas.time;
      }
      console.log(parms);
    }
    /**
     *  
     */
    function getPageData() {
      getRegion();
    }
    /**
     * 切换区域和行业
     * @param parm 
     */
    function tab(parm) {
      //parm:0:区域;1:行业
      vm.pageIndex = parm;
      $ionicSlideBoxDelegate.slide(parm);
    }
    /**
     * 模糊匹配区域和行业
     */
    function search() {
      vm.matchingTradeList = [];
      if (vm.searchTrade) {
        vm.showMatchingTrade = true;
        for (var i in vm.tradeList) {
          if (vm.tradeList[i].name.indexOf(vm.searchTrade) >= 0) {
            vm.matchingTradeList.push(vm.tradeList[i]);
          }
        }
      } else {
        vm.showMatchingTrade = false;
      }
    }

    function choose(type, id, name) {
      // parms.id = id;
      // parms.type = type;
      parms.name = name;
      if (type === 'region') {
        parms.regionId = id;
        parms.tradeId = 'null';
      } else {
        parms.regionId = 'null';
        parms.tradeId = id;
      }
      console.log(parms);
      $state.go(vm.path, parms);
    }
    /**
     * 返回到ESA页面
     */
    function goBack() {
      $state.go(vm.path, parms);
    }
    /**
     *获取区域数据 
     */
    function getRegion() {
      if(vm.regionList.length == 0){
        $rootScope.showLoadingDialog();
        tradeAndRegionService.getRegion().then(function (datas) {
          $rootScope.hideLoadingDialog();
          datas = JSON.parse(datas);
          if (datas.failed) {
            $ionicPopup.alert({
              title: '提示',
              template: datas.msg
            });
          } else {
            vm.regionList = datas.Table;
          }
        });
      }
    }
    /**
     * 获取主要行业的数据
     */
    function getKeyTrade() {
      vm.keyTrade = [];
      tradeAndRegionService.getKeyTrade().then(function (datas) {
        datas = JSON.parse(datas);
        if (datas.failed) {
          setErrorInfo(true, datas.msg);
        } else {
          var k1 = [];
          var k2 = [];
          var k3 = [];
          for (var i = 0; i < datas.data.length; i++) {
            if (i < 2) {
              k1.push(datas.data[i]);
            } else if (i < 4) {
              k2.push(datas.data[i]);
            } else {
              k3.push(datas.data[i]);
            }
          };
          vm.keyTrade.push(k1);
          vm.keyTrade.push(k2);
          vm.keyTrade.push(k3);
        }
        console.log(vm.keyTrade);
        showErrorPopAndHideDialog();
      });
    }

    /**
     * 获取行业的数据
     */
    function getTrade() {
      tradeAndRegionService.getTrade().then(function (datas) {
        datas = JSON.parse(datas);
        if (datas.failed) {
          setErrorInfo(true, datas.msg);
        } else {
          var index = "";
          var arr = '';
          vm.tradeList = [];
          for (var i = 0; i < datas.data.length; i++) {
            index = toPinyin(datas.data[i].name[0]).toUpperCase()[0];
            if (arr.indexOf(index) != -1) {
              vm.tradeList.push({
                id: datas.data[i].id,
                name: datas.data[i].name,
                index: index,
                first: false
              });
            } else {
              arr += index;
              vm.tradeList.push({
                id: datas.data[i].id,
                name: datas.data[i].name,
                index: index,
                first: true
              });
            }
          }
          console.log(vm.tradeList);
        }
        showErrorPopAndHideDialog();
      });
    }
    /**
     * 滑动切换页面的index
     * @param parm 
     */
    function slideChanged(parm) {
      vm.pageIndex = parm;
      if (parm == 0) {
        document.getElementById('region').className = 'tab-item active';
        document.getElementById('trade').className = 'tab-item';
        getPageData();
      } else if (parm == 1) {
        document.getElementById('region').className = 'tab-item';
        document.getElementById('trade').className = 'tab-item active';
        $rootScope.showLoadingDialog();
        reqNum = 0;
        errorInfo = '';
        isShowErrorPop = false;
        if (tabTime == 0) {
          tabTime = 1;
          pinYinData = tradeAndRegionService.getPinYinData();
          getKeyTrade();
          getTrade();
        } else {
          getKeyTrade();
          getTrade();
        }
      }
    }
    //////////////////////////////////////////
    var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    vm.indexs = [];
    for (var i = 0; i < chars.length; i++) {
      vm.indexs.push(chars[i]); //获取字母数组 
    }

    //
    function toPinyin(string) {
      var temp = '';
      for (var i = 0; i < string.length; i++) {
        temp += translateCode(string[i]);
      }
      return temp;
    };

    function translateCode(chinese) {
      for (var key in pinYinData) {
        var value = pinYinData[key];
        if (value.indexOf(chinese) != -1) {
          return key;
        }
      }
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
    //////////////////////////////
   }
})();

