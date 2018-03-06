(function () {
  'use strict';

  angular
    .module('app.setting')
    .controller('settingController', settingController);

  settingController.$inject = ['$scope', 'settingService','$timeout' ,
];
  /** @ngInject */
  function settingController($scope, settingService,$timeout) {
    var vm = this;
    vm.fun = {
      exitApp: exitApp
    }
    //////
    activate();
    //////
    function activate() {
    }

    function exitApp(){
      ionic.Platform.exitApp();
    }
  }
})();
