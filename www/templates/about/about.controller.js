(function () {
  'use strict';

  angular
    .module('app.about')
    .controller('aboutController', aboutController);

  aboutController.$inject = ['$scope','$timeout','$state'];
  /** @ngInject */
  function aboutController($scope,$timeout,$state) {
    var vm = this;
    vm.fun = {
      toCalculator: toCalculator,
      toNews: toNews,
      toBench: toBench
    }
    activate();
    ///////
    function activate() {} 
    //跳转到 能耗限额对标
    function toBench(){
      $state.go('benchmarking');
    }
    //跳转到 节能小贴士
    function toNews(){
      $state.go('news');
    };
    //跳转到 节能计算器
    function toCalculator(){
      $state.go('calculator');
    };

  }
})();
