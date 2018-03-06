/**
 * Created by SWAT on 2017/7/13.
 */
(function () {
  'use strict';

  angular
    .module('app.valueShow',['ionic'])
    .controller('valueShowController', valueShowController);

  valueShowController.$inject = ['$scope','$timeout','$state','$ionicLoading','$stateParams'];
  /** @ngInject */
  function valueShowController($scope,$timeout,$state,$ionicLoading,$stateParams) {
    var vm = this;
    var ValueArray = new Array()
    vm.goBack=goBack;
    function goBack(){
      $state.go('benchmarkingDataInput',{'tradeId':$stateParams.tradeId});
    }
    vm.indexValue=$stateParams.indexValue;
    vm.tradeid=$stateParams.tradeId;
    vm.ValueCol=ValueCol;
    ShowValue();
    
    function  ValueCol() {
      if(ValueJudge()==1){
        console.log(ValueArray);
        PostVlaue();
      }else {
        ShowText("部分对标结果计算失败，请检查输入值是否规范！");
      }
    };

    function PostVlaue() {
      $state.go('quotaBenchmarkingSet',{'tradeId': vm.tradeid,'indexValue':   vm.indexValue});
    }

    function  ValueJudge() {
      var state =1;
      for(var i=0;i< ValueArray.length-1;i++){
        var  tempDom=document.getElementById(ValueArray[i]);
        var TempValue = tempDom.value;
        if(TempValue==null||TempValue==''||TempValue==""){
          state =0;
        }
      }
      return state;
    };

    function  ShowValue() {
      var datas= JSON.parse(vm.indexValue);
      $scope.itemlist = [];
      for(var i=0;i<datas.length;i++){
        var Tname = datas[i].Name;
        var Tid=datas[i].Symbol;
        var UnitName=datas[i].UnitName;
        var Tvalue=datas[i].Value;
        if(UnitName!=""&&UnitName!=''&&UnitName!=null){
            UnitName="("+UnitName+")";
          }
          var obj={itemName:Tname,itemId:Tid,itemUn:UnitName,itemValue:Tvalue};
        ValueArray.push(Tid);
          $scope.itemlist.push(obj);
      }
    };


    function failed(){
      $timeout(function () {
        $ionicLoading.show({
          template: '网络连接失败！'
        });
        FailText();
      }, 3000);
    };

    function  FailText() {
      $timeout(function () {
        $ionicLoading.hide();
      }, 2000);
    };

    function ShowText(textContent) {
      $ionicLoading.show({
        template: textContent
      });
      FailText();
    };


  }
})();
