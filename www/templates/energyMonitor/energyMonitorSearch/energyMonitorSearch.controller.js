(function () {
  "use strict";

  angular
    .module("app.energyMonitorSearch")
    .controller("energyMonitorSearchController", energyMonitorSearchController);

  energyMonitorSearchController.$inject = [
    '$rootScope',
    "$scope",
    "energyMonitorSearchService",
    "$timeout",
    "$state",
    "$stateParams",
    "$ionicPopup",
    "loginService",
    '$localStorage'
  ];
  /** @ngInject */
  function energyMonitorSearchController(
    $rootScope,
    $scope,
    energyMonitorSearchService,
    $timeout,
    $state,
    $stateParams,
    $ionicPopup,
    loginService,
    $localStorage
  ) {
    var vm = this;
    vm.showAreaEnterprise = true;//在非模糊查询企业时，显示地区和企业列表
    vm.showMatchingEnterprise = false;//在模糊查询企业时，该值为true，显示模糊查询到的企业列表，同时隐藏掉地区和企业列表
    vm.enterpriseName = "";
    vm.localStorageEnterpriseList = [];
    vm.listData = [];
    vm.matchingEnterpriseList = [];
    vm.fun = {
      matchingEnterprise: matchingEnterprise,
      open: open,
      toEnergyMonitorPage: toEnergyMonitorPage
    };
    //////
    getPageData();
    activate();

    function activate() { }

    /**
     * 进入页面就获取相关的数据
     */
    function getPageData() {
      getLocalEnterpriseData();
      getEnterpriseList();
    }

    /**
     * 获取缓存在本地的最近访问的4个企业名称
     */
    function getLocalEnterpriseData() {
      if ($localStorage.energyMonitorEnterprise) {
        vm.localStorageEnterpriseList = $localStorage.energyMonitorEnterprise.data;
      }
    }

    function toEnergyMonitorPage(item) {
      $state.go('energyMonitor', { enterpriseId: item.id, 'enterpriseName': item.name });
    }

    /**
     * 模糊查询某个企业
     */
    function matchingEnterprise() {
      var copName = document.getElementById("enterpriseName").value;
      filtResult(copName);
    }

    /**
     *展开列表
     */
    function open(item) {
      if (item.url != '') {
        var hasThisEnterprise = false;//判断当前
        for (var i in vm.localStorageEnterpriseList) {
          if (item.enterpriseId == vm.localStorageEnterpriseList[i].id) {
            hasThisEnterprise = true;
          }
        }
        if (!hasThisEnterprise) {
          var enterpriseNewJson = {
            id: item.enterpriseId,
            name: item.name
          }
          if (vm.localStorageEnterpriseList.length >= 4) {
            vm.localStorageEnterpriseList.shift();
            vm.localStorageEnterpriseList.push(enterpriseNewJson);
            var savedJson = {
              data: vm.localStorageEnterpriseList
            }
            $localStorage.energyMonitorEnterprise = savedJson;
          } else {
            vm.localStorageEnterpriseList.push(enterpriseNewJson);
            var savedJson = {
              data: vm.localStorageEnterpriseList
            }
            $localStorage.energyMonitorEnterprise = savedJson;
          }
        }
      }
      var param = item.areaId;
      var dom = document.getElementsByName(param);
      var domNumber = dom.length;
      if (dom[1].style.display == "none") {
        dom[0].getElementsByTagName("i")[0].className = "icon ion-chevron-up";
      } else {
        dom[0].getElementsByTagName("i")[0].className = "icon ion-chevron-down";
      }
      for (var i = 1; i < domNumber; i++) {
        if (dom[i].style.display == "none") {
          dom[i].style.display = "block";
          dom[i].getElementsByTagName("a")[0].style.backgroundColor = "#e8ede9";
          dom[i].getElementsByTagName("i")[0].className = "";
        } else {
          dom[i].style.display = "none";
        }
      }
    }

    /**
     * 获取企业的相关数据
     */
    function getEnterpriseList() {
      $rootScope.showLoadingDialog();
      var name = "";
      energyMonitorSearchService.getEnterpriseTree().then(function (datas) {
        $rootScope.hideLoadingDialog();
        datas = JSON.parse(datas);
        if (datas.failed) {
          $ionicPopup.alert({
            title: "提示",
            template: datas.msg
          });
        } else {
          var enterpriseJsonArray = datas.data;
          var listData = [];
          var mark = "";
          for (var i = 0; i < enterpriseJsonArray.length; i++) {
            var areaData = {
              areaId: "",
              enterpriseId: "",
              name: "",
              display: "",
              fontColor: "",
              url: "",
              paddingLeft: ""
            };
            areaData.areaId = 'area' + i;
            areaData.name = enterpriseJsonArray[i].name;
            areaData.display = "block";
            areaData.fontColor = "#65A54F";
            areaData.paddingLeft = 5;
            mark = i;
            listData.push(areaData);
            for (var j = 0; j < enterpriseJsonArray[i].enterprise.length; j++) {
              var enterpriseData = {
                areaId: "",
                enterpriseId: "",
                name: "",
                display: "",
                fontColor: "",
                url: "",
                paddingLeft: ""
              };
              enterpriseData.areaId = 'area' + i;
              enterpriseData.enterpriseId = enterpriseJsonArray[i].enterprise[j].DepartId;
              enterpriseData.name = enterpriseJsonArray[i].enterprise[j].Name;
              enterpriseData.display = "none";
              enterpriseData.fontColor = "#333333";
              enterpriseData.url =
                "#/energyMonitor" +
                "/" +
                enterpriseJsonArray[i].enterprise[j].DepartId +
                "/" +
                enterpriseJsonArray[i].enterprise[j].Name;
              enterpriseData.paddingLeft = 15;
              listData.push(enterpriseData);
            }
          }
          vm.listData = listData;
        }
      });
    }

    /**
     * 模糊搜索企业
     * @param keyWord 
     */
    function filtResult(keyWord) {
      if (keyWord == '') {
        vm.showAreaEnterprise = true;
        vm.showMatchingEnterprise = false;
      } else {
        vm.showAreaEnterprise = false;
        vm.showMatchingEnterprise = true;
        vm.matchingEnterpriseList = [];
        for (var i in vm.listData) {
          var name = vm.listData[i].name;
          var url = vm.listData[i].url;
          if (name.indexOf(keyWord) >= 0 && url !== '') {
            vm.matchingEnterpriseList.push(vm.listData[i]);
          }
        }
      }
    }

  }
})();
