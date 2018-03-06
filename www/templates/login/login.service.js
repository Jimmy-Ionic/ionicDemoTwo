(function () {
  'use strict';

  angular
    .module('app.login')
    .service('Session', Session)
    .factory('loginService', loginService);

  Session.$inject = ['$localStorage'];
  loginService.$inject = ['$http', 'SYS_INFO', 'Session'];

  function Session($localStorage) {
    
    var service = {
      UserInfo: getUserInfo(),
      create: create,
      destroy: destroy,
      isAuthenticated: isAuthenticated,
      
    };

    return service;

    ////////////////

    function create(info) {
      var userInfo = {
        userId: '',
        userName: ''
      };

      if (info) {
        userInfo.userId = info.UserId;
        userInfo.userName = info.UserName;
      }

      $localStorage.userInfo = userInfo;
      $localStorage.isLogin = true;
    }

    function getUserInfo() {
      var userInfo = {
        userId: '',
        userName: ''
      };

      if ($localStorage.userInfo) {
        userInfo.userId = $localStorage.userInfo.userId;
        userInfo.userName = $localStorage.userInfo.userName;
      }

      return userInfo;
    }

    function destroy() {
      delete $localStorage.userInfo;
      delete $localStorage.isLogin;
    }

    function isAuthenticated() {
      return $localStorage.isLogin;
    }

    
  }

  function loginService($http, SYS_INFO, Session) {
    var departmentId;
    var userid;
    var service = {
      login: login,
      getDepartmentId: getDepartmentId,
      getUserId:getUserId
    };

    return service;

    // //////////////
    function login(userName, pwd) {

            return $http({
                method: "POST",
                data: {
                   "account":userName,
                    "password":pwd
                },
                url: SYS_INFO.SERVER_PATH+'/RestService.svc/rest/login'
            }).then(loginComplete).catch(loginFailed);
     
    }

    function loginComplete(response) {
      var datas=JSON.parse(response.data);
      departmentId=datas.msg[0].DepartMemberId;
      userid=datas.msg[0].Id;
      return response.data;
    }

    function loginFailed() {
      var result = {
        failed: false
      };

      return result;
    }

    function getDepartmentId(){
        return departmentId;
    }

    function getUserId(){
      return userid;
    }
  }
})();
