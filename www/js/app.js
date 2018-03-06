(function () {
  'use strict';
  // Ionic Starter App

  // angular.module is a global place for creating, registering and retrieving Angular modules
  // 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
  // the 2nd parameter is an array of 'requires'
  // 'starter.services' is found in services.js
  // 'starter.controllers' is found in controllers.js
  angular.module('app', [
    'ionic',
    'ngStorage',
    'ng-echarts',
    'ionic-datepicker',
    'onezone-datepicker',
    'ionic-monthpicker',
    'ion-tree-list',
    'app.login',
    'app.home',
    'app.about',
    'app.setting', // autoRegisterModule
    'app.ECA', //能源消耗分析
    'app.analyse',
    'app.energysaving',
    'app.ECAson',
    'app.tradeAndRegion',
    'app.ESA',
    'app.news',
    'app.calculator',
    'app.search',
    'app.energyMonitor',
    'app.energyRank', //能耗宣传
    'app.energyMonitorSearch',
    'app.consumption', //产值单耗分析
    'app.consumptionSearch',
    'app.benchmarkingDataInput',
    'app.benchmarking',
    'app.valueShow',
    'app.quotaBenchmarkingSet',
    'app.quotaBenchmarkingRealTime',
    'app.newsContent'
  ])
    .run(run)
    .config(config)
    .constant('SYS_INFO', {
      // TODO: 数据访问服务地址（此处定义了手机应用获取数据的服务地址，需要修改成项目实际的地址）
      // TODO: 注意：手机应用发布之前需要修改为生产环境发布的数据服务地址
      /*'SERVER_PATH': 'http://192.168.0.213:8080',*/
      // 'SERVER_PATH': 'http://59.52.20.32:23313',
      'SERVER_PATH': 'http://111.40.66.140:5004',
      'SERVER_PATH_DB': 'http://111.40.66.140:8077',
      // 'SERVER_PATH': 'http://172.72.101.177:5004',
      // 'SERVER_PATH':'http://172.72.101.193:23313',
      'VERSION': '1.0.0',
      // TODO: 数据小数位数（统一设置手机应用中数据的小数位数，可以根据实际情况修改）
      'DIGITS': 2
    });

  run.$inject = [
    '$rootScope',
    '$location',
    'Session',
    '$ionicPlatform',
    '$ionicHistory',
    '$ionicPopup',
    '$ionicLoading'
  ];

  function run($rootScope,
    $location,
    Session,
    $ionicPlatform,
    $ionicHistory,
    $ionicPopup,
    $ionicLoading) {
    $ionicPlatform.ready(function () {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);

      }

      if (window.cordova && window.cordova.InAppBrowser) {
        window.open = window.cordova.InAppBrowser.open;
      }

      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault();
      }

      if (window.codePush) {
        var updateInfoMsg;
        $rootScope.downloadMsg = '';

        var onError = function (error) {
          updateInfoMsg.close();
          $ionicPopup.alert({
            title: '更新提示',
            template: '更新失败！'
          });
        };

        var onInstallSuccess = function () {
          updateInfoMsg.close();
          $ionicPopup.alert({
            title: '更新提示',
            template: '更新成功！'
          }).then(function () {
            codePush.restartApplication();
          });
        };

        var toFix = function (val) {
          return (val / 1024).toFixed(2);
        };

        var onProgress = function (downloadProgress) {
          $rootScope.downloadMsg = toFix(downloadProgress.receivedBytes) + 'kb 共' + toFix(downloadProgress.totalBytes) + 'kb';
        };

        var onPackageDownloaded = function (localPackage) {
          localPackage.install(onInstallSuccess, onError, {
            installMode: InstallMode.ON_NEXT_RESUME,
            minimumBackgroundDuration: 120,
            mandatoryInstallMode: InstallMode.ON_NEXT_RESTART
          });
        };

        var onUpdateCheck = function (remotePackage) {
          if (remotePackage && !remotePackage.failedInstall) {
            $ionicPopup.confirm({
              title: '更新提示',
              template: '有可用的新版本，是否需要更新？',
              cancelText: '否',
              okText: '是'
            }).then(function (res) {
              if (res) {
                updateInfoMsg = $ionicPopup.show({
                  template: '<span>正在下载 {{downloadMsg}}</span>',
                  scope: $rootScope,
                  title: '更新提示'
                });
                remotePackage.download(onPackageDownloaded, onError, onProgress);
              }
            });
          }
        };

        window.codePush.checkForUpdate(onUpdateCheck, onError);
      }
    });

    $rootScope.$on('$stateChangeStart', function (event, next) {
      if (next.name !== 'login') {
        if (!Session.isAuthenticated()) {
          $location.path('/login');
        }
      }
    });
    /**
     * 全局设置返回上一页面的方法
     */
    $rootScope.goBack = function () {
      $ionicHistory.goBack();
    }
     /**
     * 显示通用的dialog
     */
    $rootScope.showDialog = function (title) {
      $ionicLoading.show({
        templateUrl: 'templates/common/html/loading.html',
        template: title,
        duration: 20 * 1000
      })
    }
    /**
     * 显示loading dialog
     */
    $rootScope.showLoadingDialog = function () {
      $ionicLoading.show({
        template: '正在加载数据，请稍候...'
      })
    }
    /**
     * 隐藏loading dialog
     */
    $rootScope.hideLoadingDialog = function () {
      $ionicLoading.hide()
    }
    /**
     * 弹出提示窗
     */
    $rootScope.showAlert = function (msg) {
      $ionicPopup.alert({
        title: '提示',
        template: msg
      });
    }
    /**
     * 过滤number类型的数据
     * @param data 
     * @param digit
     */
    $rootScope.filterNumber = function (number, digit) {
      if (number) {
        number = parseFloat(number);
        return number.toFixed(digit);
      } else {
        return '-';
      }
    }
    /**
     * 转化数值，可以转化为千，万
     * @param {*} number 
     * @param {*} digit 
     */
    $rootScope.transformNumber = function (number, digit) {
      if (number) {
        number = parseFloat(number);
        number = number / digit;
        return number;
      } else {
        return '-';
      }
    }
    /**
     * 分割字符串
     */
    $rootScope.splitStr = function (str, symbol) {
      if (str) {
        var strArray = str.split(symbol);
        return strArray;
      } else {
        return [];
      }
    }
    /**
     * http请求成功时调用的回调方法
     */
    $rootScope.getDatasSuccess = function (response) {
      return response.data;
    }
    /**
     * http请求失败是调用的回调方法
     */
    $rootScope.getDatasFailed = function (error) {
      var result = '';
      switch (error.status) {
        case -1:
          result = '{"failed":"true","msg":"网络连接不稳定，请检查网络情况"}';
          break;
        case 404:
          result = '{"failed":"true","msg":"请求的资源不存在"}';
          break;
        default:
          result = '{"failed":"true","msg":"' + error.status + ' ' + error.statusText + '"}';
          break;
      }
      return result;
    }
    /**
     * 由于一些企业名称太长显示不开，可以点击名称，弹出dialog
     */
    $rootScope.showName = function (title, name) {
      var ionicDialogData = {};
      ionicDialogData.title = title;
      ionicDialogData.template = name;
      $ionicPopup.alert(ionicDialogData).then(function () {
      });
    }
    /**
     * 主页面显示退出提示框
     */
    $ionicPlatform.registerBackButtonAction(function (e) {
      e.preventDefault();
      // Is there a page to go back to?
      var path = $location.path();
      if (path === '/homePage' || path === '/login') {
        ionic.Platform.exitApp();
      } else if ($ionicHistory.backView) {
        // Go back in history
        $ionicHistory.goBack();
      } else {
        ionic.Platform.exitApp();
      }

      return false;
    }, 101);
  }

  // 配置模块，控制不同平台的兼容性
  function config($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
    $ionicConfigProvider.platform.ios.tabs.style('standard');
    $ionicConfigProvider.platform.ios.tabs.position('bottom');
    $ionicConfigProvider.platform.android.tabs.style('standard');
    $ionicConfigProvider.platform.android.tabs.position('standard');

    $ionicConfigProvider.platform.ios.navBar.alignTitle('center');
    $ionicConfigProvider.platform.android.navBar.alignTitle('center');

    $ionicConfigProvider.platform.ios.backButton.previousTitleText('').icon('ion-ios-arrow-thin-left');
    $ionicConfigProvider.platform.android.backButton.previousTitleText('').icon('ion-android-arrow-back');

    $ionicConfigProvider.platform.ios.views.transition('ios');
    $ionicConfigProvider.platform.android.views.transition('android');

    $urlRouterProvider.otherwise('/login');
  }
})();

