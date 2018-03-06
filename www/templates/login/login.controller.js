/* global hex_md5 */
(function () {
  'use strict';

  angular
    .module('app.login')
    .controller('LoginController', LoginController);

  LoginController.$inject = [
    '$rootScope',
    '$scope',
    '$state',
    '$ionicPopup',
    '$ionicLoading',
    'loginService',
    'Session',
    '$timeout',
    'SYS_INFO'
  ];

  function LoginController($rootScope,
                           $scope,
                           $state,
                           $ionicPopup,
                           $ionicLoading,
                           loginService,
                           Session,
                           $timeout,
                           SYS_INFO) {

    var vm = this;
    vm.title = SYS_INFO.APP_TITLE;
    vm.dologin = dologin;

    activate();

    ////////////////
    function activate() {
      Session.destroy();
    }

    function dologin() {
      $ionicLoading.show({
        template: '正在登录...'
      });
      // loginService.login(vm.username, hex_md5(vm.password))
      loginService.login(vm.username,vm.password)
        .then(function (data) {
          $ionicLoading.hide();
          data=eval("(" +data+ ")"); 
          if (data.failed!=="false") {
            $ionicPopup.alert({
              title: '登陆失败',
              template: data.msg,
            }).then(function (res) {
            });
          } else {
            $timeout(function () {
              Session.create(data.msg[0]);
            }, 100).then(function () {
              $state.go('home.energyRank',{condition:''});
            });
          }
        });
    }
  }
})();
