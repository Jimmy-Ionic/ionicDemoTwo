/**
 * Created by admin on 2017/6/5.
 */
(function () {
  'use strict';

  angular
    .module('app.quotaBenchmarkingSet')
    .controller('quotaBenchmarkingSetController', quotaBenchmarkingSetController);

  quotaBenchmarkingSetController.$inject = ['$timeout','$state','quotaBenchmarkingSetService','$stateParams'];
  function quotaBenchmarkingSetController($timeout,$state,quotaBenchmarkingSetService,$stateParams) {
    var vm = this;

    vm.GetStandardType=GetStandardType;
    vm.ConstructScope=ConstructScope;

    vm.goBack=goBack;
    function goBack(){
      // $state.go('app.HyzbList',{'tradeId':$stateParams.tradeId});
      $state.go('valueShow',{'tradeId':$stateParams.tradeId,'indexValue':   $stateParams.indexValue});
    }

    vm.toRealTime=toRealTime;
    function toRealTime() {
      vm.url=document.URL;

      vm.indexValue=$stateParams.indexValue;

      vm.tradeid=$stateParams.tradeId;
      vm.standid='fcdf8558-3e66-45d4-ac58-f9a6d46c61dc';

      vm.standardtype=document.getElementById('type').value.substr(7);


////////////////////////////////////////////////////////////////
      quotaBenchmarkingSetService.ConstructScope($stateParams.tradeId).then(function(datas){

        var scopeDates=datas;
        quotaBenchmarkingSetService.GetAllScope($stateParams.tradeId).then(function(datas){
          var Scopes=datas.Datas.rows;

          var numput="";
          var selecttext=""
          for(var i=0;i<Scopes.length;i++)
          {
            if(Scopes[i].StandardType=="国家标准")
            {
              var copyId=Scopes[i].Id;
              var copyName=Scopes[i].Name;

              if(Scopes[i].ScopeType=="文本类型")
              {
                var arrayData=scopeDates.Data[copyId];
                if (arrayData!=undefined)
                {
                  var  myselect=document.getElementById(copyId);
                  var index=myselect.selectedIndex;

                  selecttext+="@" + copyId + "@" +myselect.options[index].value+ "@text";
                }
                else
                {
                  numput+="@" + copyId + "@" + document.getElementById(copyId).value + "@text";
                }
              }

              if(Scopes[i].ScopeType=="数值区间")
              {
                numput+="@" + copyId + "@" + document.getElementById(copyId).value + "@num";
              }

            }
          }

          vm.scope=numput+selecttext;


          quotaBenchmarkingSetService.GetStandardType().then(function(datas){
            for(var i=0;i<datas.length;i++) {
              if(datas[i].Id==vm.standardtype)
              {
                vm.standardtypeName=datas[i].Name;
                $state.go('quotaBenchmarkingRealTime',{'tradeid':vm.tradeid,'standid':vm.standid,'scope':vm.scope,'indexValue':vm.indexValue,'standardtype':vm.standardtype,'standardtypeName':vm.standardtypeName,'url':vm.url});
              }
            }
          });
          //
        });

      });
      //$state.go('app.quotaBenchmarkingRealTime',{'tradeid':vm.tradeid,'standid':vm.standid,'scope':vm.scope,'indexValue':vm.indexValue.toString(),'standardtype':vm.standardtype,'standardtypeName':vm.standardtypeName});

    }

    GetStandardType();
    function GetStandardType() {
      var listData=[];

      quotaBenchmarkingSetService.GetStandardType().then(function(datas){
        vm.type=datas[0].Id;
        listData=[];
        var mark='';
        for(var i=0;i<datas.length;i++){
          var data={
            Id:'',
            Name:''
          }

          data.Id=datas[i].Id;
          data.Name=datas[i].Name;
          listData.push(data);

        }
        vm.StandardTypeData = listData;

      });
    }

    ConstructScope($stateParams.tradeId);
    function ConstructScope(tradeid) {
      quotaBenchmarkingSetService.ConstructScope(tradeid).then(function(datas){

        var scopeDates=datas;
        quotaBenchmarkingSetService.GetAllScope(tradeid).then(function(datas){
          var Scopes=datas.Datas.rows;
          for(var i=0;i<Scopes.length;i++)
          {
            if(Scopes[i].StandardType=="国家标准")
            {
              var copyId=Scopes[i].Id;
              var copyName=Scopes[i].Name;

              if(Scopes[i].ScopeType=="文本类型")
              {
                var listData="";
                var arrayData=scopeDates.Data[copyId];
                if (arrayData!=undefined)
                {
                for(var j=0;j<arrayData.length;j++){
                  listData+="<option>"+arrayData[j]+"</option>";
                }
                var str="<div class='item item-input item-select'><div class='input-label'>"+copyName+"</div><select  id='"+copyId+"'>"+listData+"</select></div></div>";
                document.getElementById("mycontent").innerHTML+=str;
                }
                else
                {
                  var str="<div class='list'><label class='item item-input'><span class='input-label'>"+Scopes[i].Name+"</span><input type='text' id='"+Scopes[i].Id+"'></label></div>";
                  document.getElementById("mycontent").innerHTML+=str;
                }
              }

              if(Scopes[i].ScopeType=="数值区间")
              {
                var str="<div class='list'><label class='item item-input'><span class='input-label'>"+Scopes[i].Name+"</span><input type='text' id='"+Scopes[i].Id+"'></label></div>";
                document.getElementById("mycontent").innerHTML+=str;
              }

            }
          }
        });

      });
    }
  }
  //
})();
