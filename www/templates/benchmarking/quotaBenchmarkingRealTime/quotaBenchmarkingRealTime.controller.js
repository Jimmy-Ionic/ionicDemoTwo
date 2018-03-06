/**
 * Created by admin on 2017/6/6.
 */
(function () {
  'use strict';

  angular
    .module('app.quotaBenchmarkingRealTime')
    .controller('quotaBenchmarkingRealTimeController', quotaBenchmarkingRealTimeController);

  quotaBenchmarkingRealTimeController.$inject = ['$timeout','$state','quotaBenchmarkingRealTimeService','$stateParams','$scope'];
  function quotaBenchmarkingRealTimeController($timeout,$state,quotaBenchmarkingRealTimeService,$stateParams,$scope) {
    var vm = this;

    var standid=$stateParams.standid;
    var tradeid=$stateParams.tradeid;
    var scope=$stateParams.scope;
    var indexValue=$stateParams.indexValue;
    var standardtype=$stateParams.standardtype;
    var standardtypeName=$stateParams.standardtypeName;
    console.log(standid+"/n" +tradeid+"/n"+scope+"/n"+indexValue+"/n"+standardtype+"/n"+standardtypeName)

    quotaBenchmarkingRealTimeService.GetBenchMarking(tradeid,standid,scope,indexValue).then(function(datas){
      console.log(datas);
      var arrayData=datas.Data['rows'];
      if(arrayData.length>0){
        $scope.itemlist = [];
        var status=arrayData[0]["status" + standardtype];
        var ClassText ="color: black;";
        if (status== 0) {
          ClassText="color:green;";
        } else if (status== 1) {
          ClassText="color:red;";
        } else if (status== undefined){
          ClassText="color:red;";
        }
        for(var i=0;i<arrayData.length;i++){
          var obj1={itemName:"指标名称",itemId:arrayData[i].IndexName,itemstyle:"color: black;"};
          $scope.itemlist.push(obj1);
          var obj2={itemName:"实际值",itemId:arrayData[i].RealValue,itemstyle:ClassText};
          $scope.itemlist.push(obj2);
          var obj3={itemName:standardtypeName,itemId:arrayData[i]["targetvalue"+standardtype]==undefined?"无标准":arrayData[i]["targetvalue"+standardtype],itemstyle:ClassText};
          $scope.itemlist.push(obj3);
          var obj4={itemName:"达标差",itemId:arrayData[i]["difference"+standardtype]==undefined?"-":arrayData[i]["difference"+standardtype].toFixed(2),itemstyle:ClassText};
          $scope.itemlist.push(obj4);
          var obj5={itemName:"达标率",itemId:arrayData[i]["ratio"+standardtype]==undefined?"-":parseFloat(arrayData[i]["ratio"+standardtype].replace('%','')).toFixed(2)+"%",itemstyle:ClassText};
          $scope.itemlist.push(obj5);
          var obj6={itemName:"潜力指数",itemId:arrayData[i]["potential"+standardtype]==undefined?"-":arrayData[i]["potential"+standardtype].toFixed(2),itemstyle:ClassText};
          $scope.itemlist.push(obj6);
          var obj7={itemName:"",itemId:"",itemstyle:""};
          $scope.itemlist.push(obj7);
        }
      }
    });


    vm.goBack=goBack;

    function goBack(){
      self.location=$stateParams.url;
    }
  }
  //
})();
