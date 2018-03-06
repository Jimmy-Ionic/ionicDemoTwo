(function () {
  'use strict'

  angular
    .module('app.analyse')
    .controller('analyseController', analyseController)

  analyseController.$inject = ['$scope', 'analyseService', '$timeout', '$state']
  /** @ngInject */
  function analyseController($scope, analyseService, $timeout, $state) {
    var vm = this;
    vm.fun = {
      toOtherPage: toOtherPage
    }
    ////////////
    activate();
    ////////////
    function activate() {
      vm.listData = analyseService.getList();
    }

    /**
     * 跳转到其他的页面
     * @param id 
     */
    function toOtherPage(id) {
      switch (id) {
        case 0:
          $state.go('home.energyRank', {
            condition: ''
          });
          break;
        case 1:
          $state.go('energyMonitor', {
            enterpriseId: '',
            enterpriseName: ''
          });
          break;
        case 2:
          $state.go('consumption');
          break;
        case 3:
          $state.go('energysaving');
          break;
        case 4:
          $state.go('ECA', {
            name: '',
            regionId: 'null',
            tradeId: 'null',
            timeType: '',
            time: ''
          });
          break;
        default:
          break;
      }
    }
  }
})();
