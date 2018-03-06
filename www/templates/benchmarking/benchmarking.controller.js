(function () {
  'use strict';

  angular
    .module('app.benchmarking', ['ionic'])
    .controller('benchmarkingController', benchmarkingController);

  benchmarkingController.$inject = ['$rootScope', '$scope', '$timeout', '$state', 'benchmarkingService', '$ionicLoading'];
  /** @ngInject */
  function benchmarkingController($rootScope, $scope, $timeout, $state, benchmarkingService, $ionicLoading) {
    var vm = this;
    var listData = [];
    vm.fun = {
      open: open
    }
    //////
    activated();

    function activated() {
      getHY();
    }

    function open(parm) {
      var dom = document.getElementsByName(parm);
      var dom_number = dom.length;
      for (var i = 1; i < dom_number; i++) {
        if (dom[i].style.display == 'none') {
          if (i == 1) {
            dom[0].getElementsByTagName('i')[0].className = 'icon ion-chevron-up icon-accessory'
          }
          dom[i].style.display = 'block';
          dom[i].getElementsByTagName('a')[0].style.backgroundColor = '#e8ede9';
          dom[i].getElementsByTagName('i')[0].className = '';
        } else {
          if (i == 1) {
            dom[0].getElementsByTagName('i')[0].className = 'icon ion-chevron-down icon-accessory'
          }
          dom[i].style.display = 'none';
        }
      }
    }

    /**
     * 获取限额对标工具页面的行业数据
     */
    function getHY() {
      $rootScope.showLoadingDialog();
      benchmarkingService.getHy()
        .then(function (datas) {
          $rootScope.hideLoadingDialog();
          console.log(JSON.stringify(datas));
          listData = [];
          var mark = '';
          if (datas) {
            for (var i = 0; i < datas.length; i++) {
              var data = {
                id: '',
                lastText: '',
                display: '',
                fontColor: '',
                url: '',
                paddingLeft: ''
              }
              data.id = i;
              data.lastText = datas[i].text;
              data.display = 'block';
              data.fontColor = '#65A54F';
              data.paddingLeft = 30;
              mark = i;
              listData.push(data);
              for (var j = 0; j < datas[i].children.length; j++) {
                var datachild = {
                  id: '',
                  lastText: '',
                  display: '',
                  fontColor: '',
                  url: '',
                  paddingLeft: ''
                }
                datachild.id = mark;
                datachild.lastText = datas[i].children[j].text;
                datachild.display = 'none';
                datachild.fontColor = '#333333';
                datachild.url = '#/benchmarkingDataInput/' + datas[i].children[j].id;
                datachild.paddingLeft = 36;
                listData.push(datachild);
              }
            }
            vm.listData = listData;
            $ionicLoading.hide();
          } else { failed(); }
        }).catch(failed);
    };



    function failed() {
      $timeout(function () {
        $ionicLoading.show({
          template: '网络连接失败！'
        });
        FailText();
      }, 3000);
    };

    function FailText() {
      $timeout(function () {
        $ionicLoading.hide();
      }, 2000);
    };


  }
})();
