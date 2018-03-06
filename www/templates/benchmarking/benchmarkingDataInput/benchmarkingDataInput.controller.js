/**
 * Created by SWAT on 2017/7/13.
 */
(function () {
  'use strict';

  angular
    .module('app.benchmarkingDataInput', ['ionic'])
    .controller('benchmarkingDataInputController', benchmarkingDataInputController);

  benchmarkingDataInputController.$inject = ['$rootScope','$scope', '$timeout', '$state', 'benchmarkingDataInputService', '$ionicLoading', '$stateParams','$ionicPopup'];
  /** @ngInject */
  function benchmarkingDataInputController($rootScope,$scope, $timeout, $state, benchmarkingDataInputService, $ionicLoading, $stateParams, $ionicPopup) {
    var vm = this;
    var industryId = '';
    var result = [];
    var indexValue = [];
    var valueArray = [];
    vm.itemlist = [];
    vm.fun = {
      valueCol: valueCol
    }
    //////
    activate();

    function activate() {
      $scope.$on('$ionicView.beforeEnter', function (event, view) {
        initPageData();
        getCS();
      });
    }

    /**
     * 初始化以及处理页面的一些数据
     */
    function initPageData(){
      if($stateParams.tradeId){
        industryId = $stateParams.tradeId;
      }  
    }

    /**
     * 计算
     */
    function valueCol() {
      if (valueJudge() == 1) {
        for (var i = 0; i < valueArray.length; i++) {
          var tempDomName = valueArray[i];
          for (var j = 0; j < result.length; j++) {
            if (tempDomName == result[j].Symbol) {
              var tempValues = document.getElementById(tempDomName).value;
              result[j].Value = tempValues;
              console.log(result[j].Symbol + ":" + result[j].Value + "/" + j);
            }
          }
        }
        console.log(result);
        postVlaue();
      } else {
        $rootScope.showAlert("录入数据不能为空！");
      }
    };

    /**
     * 遍历查看input中是否都有值
     */
    function valueJudge() {
      var state = true;
      for (var i = 0; i < valueArray.length; i++) {
        var tempDom = document.getElementById(valueArray[i]);
        var tempValue = tempDom.value;
        if (!tempValue) {
          state = false;
        }
      }
      return state;
    };

    function valueInner(result) {
      for (var i = 0; i < result.length; i++) {
        for (var j = 0; j < valueArray.length; j++) {
          if (result[i].Symbol == valueArray[j]) {
            var TempValues = document.getElementById(valueArray[j]).value;
            result[i].Value = TempValues;
          }
        }
      }
      for (var i = 0; i < result.length; i++) {
        if (result[i].FormulaCount == "1") {
          valueInner(result[i].children);
        }
      }
    };

    function postVlaue() {
      //var str = JSON.stringify(result)
      valueInner(result);
      console.log(result);
      benchmarkingDataInputService.PostResult(result)
        .then(function (datas) {
          if (datas.length > 0) {
            GetBenchList(datas);
          } else { failed(); }
        })
    };

    function GetBenchList(ndatas) {
      benchmarkingDataInputService.GetBenchmarkinglist(industryId)
        .then(function (datas) {
          console.log(datas);
          if (datas.length > 0) {
            console.log(ndatas);
            for (var i = 0; i < datas.length; i++) {
              for (var j = 0; j < ndatas.length; j++) {
                if (datas[i].Name == ndatas[j].Name) {
                  var obj = {
                    IndexId: ndatas[j].IndexId,
                    Value: ndatas[j].Value,
                    UnitId: ndatas[j].UnitId,
                    Name: ndatas[j].Name,
                    Symbol: ndatas[j].Symbol,
                    UnitName: ndatas[j].UnitName
                  };
                  indexValue.push(obj);
                }
              }
            }
            console.log(industryId);
            console.log(JSON.stringify(indexValue));
            // $state.go('app.QuotaBenchmarkingSet',{'tradeId':industryId,'indexValue':JSON.stringify(indexValue)});
            $state.go('valueShow', { 'tradeId': industryId, 'indexValue': JSON.stringify(indexValue) });
          } else { failed(); }
        })
    };


    /**
     * 根据行业id查询相关的对表数据
     */
    function getCS() {
      $rootScope.showLoadingDialog();
      benchmarkingDataInputService.GetCS(industryId)
        .then(function (datas) {
          console.log(datas);
          $rootScope.hideLoadingDialog();
          if (datas.failed) {
            $ionicPopup.alert(
              {
                title: '提示',
                template: datas.msg
              });
          } else {
            if (datas && datas.length > 0) {
              result = datas;
              for (var i = 0; i < datas.length; i++) {
                if (datas[i].FormulaCount == '0') {
                  var tname = datas[i].Name;
                  var tid = datas[i].Symbol;
                  var unitName = datas[i].UnitName;
                  if (unitName) {
                    unitName = "(" + unitName + ")";
                  }
                  var obj = { itemName: tname, itemId: tid, itemUn: unitName };
                  valueArray.push(tid);
                  vm.itemlist.push(obj);
                }
              }
            }
          }
        })
    };
  }
})();
