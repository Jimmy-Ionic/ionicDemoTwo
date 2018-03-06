(function () {
  'use strict';

  angular
    .module('app.home')
    .controller('HomeController', HomeController);

  HomeController.$inject = [
    '$scope',
    '$state',
    '$filter',
    'Session',
    'homeService',
    'SYS_INFO'
  ];

  function HomeController($scope,
                          $state,
                          $filter,
                          Session,
                          homeService,
                          SYS_INFO) {
    var vm = this;
    vm.user = Session.UserInfo.userName;
    activate();

    ////////////////

    function activate() {
    }
    
  }
})();
