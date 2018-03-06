(function() {
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
      'ngCordova',
      'app.login',
      'app.home',
      'app.main',
      'app.homePage',
      'app.about',
      'app.userInfo',
      'app.detail',
      'app.setting', // autoRegisterModule
       'app.energyAnalyze', // autoRegisterModule
       'app.energyHistory',
       'app.energyPublicity',    
          'app.ECA',//能源消耗分析
	   'app.analyse',
      'app.energysaving',      'app.ECAson',
      'app.tradeAndRegion',
      'app.ESA',
      'app.ECAH',
      'app.analyzeOutput',
      'app.region',
      'app.benchmarking',
      'app.increasingConsumption'
    ])
    .run(run)
    .config(config)
    .constant('SYS_INFO', {
      // TODO: 数据访问服务地址（此处定义了手机应用获取数据的服务地址，需要修改成项目实际的地址）
      // TODO: 注意：手机应用发布之前需要修改为生产环境发布的数据服务地址
      //'SERVER_PATH': 'http://192.168.0.213:8080',
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
    '$ionicPopup'
  ];

  function run($rootScope,
    $location,
    Session,
    $ionicPlatform,
    $ionicHistory,
    $ionicPopup) {
    $ionicPlatform.ready(function() {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);

      }
      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault();
      }

      if (window.codePush) {
        var updateInfoMsg;
        $rootScope.downloadMsg = '';

        var onError = function(error) {
          updateInfoMsg.close();
          $ionicPopup.alert({
            title: '更新提示',
            template: '更新失败！'
          });
        };

        var onInstallSuccess = function() {
          updateInfoMsg.close();
          $ionicPopup.alert({
            title: '更新提示',
            template: '更新成功！'
          }).then(function() {
            codePush.restartApplication();
          });
        };

        var toFix = function(val) {
          return (val / 1024).toFixed(2);
        };

        var onProgress = function(downloadProgress) {
          $rootScope.downloadMsg = toFix(downloadProgress.receivedBytes) + 'kb 共' + toFix(downloadProgress.totalBytes) + 'kb';
        };

        var onPackageDownloaded = function(localPackage) {
          localPackage.install(onInstallSuccess, onError, {
            installMode: InstallMode.ON_NEXT_RESUME,
            minimumBackgroundDuration: 120,
            mandatoryInstallMode: InstallMode.ON_NEXT_RESTART
          });
        };

        var onUpdateCheck = function(remotePackage) {
          if (remotePackage && !remotePackage.failedInstall) {
            $ionicPopup.confirm({
              title: '更新提示',
              template: '有可用的新版本，是否需要更新？',
              cancelText: '否',
              okText: '是'
            }).then(function(res) {
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

    $rootScope.$on('$stateChangeStart', function(event, next) {
      if (next.name !== 'login') {
        if (!Session.isAuthenticated()) {
          $location.path('/login');
        }
      }
    });

    //主页面显示退出提示框
    $ionicPlatform.registerBackButtonAction(function(e) {
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
    $ionicConfigProvider.platform.android.navBar.alignTitle('left');

    $ionicConfigProvider.platform.ios.backButton.previousTitleText('').icon('ion-ios-arrow-thin-left');
    $ionicConfigProvider.platform.android.backButton.previousTitleText('').icon('ion-android-arrow-back');

    $ionicConfigProvider.platform.ios.views.transition('ios');
    $ionicConfigProvider.platform.android.views.transition('android');

    $urlRouterProvider.otherwise('/login');
  }
})();

(function () {
  'use strict';

  angular.module('app.about', []);
})();

(function () {
  'use strict';

  angular.module('app.analyse', []);
})();

(function () {
  'use strict';

  angular.module('app.detail', []);
})();

(function () {
  'use strict';

  angular.module('app.ECA', []);
})();

(function () {
  'use strict';

  angular.module('app.ECAH', []);
})();

(function () {
  'use strict';

  angular.module('app.energyAnalyze', []);
})();

(function () {
  'use strict';

  angular.module('app.energyPublicity', []);
})();

(function () {
  'use strict';

  angular.module('app.energysaving', []);
})();

(function () {
  'use strict';

  angular.module('app.ESA', []);
})();

(function () {
  'use strict';

  angular.module('app.home', []);
})();

(function () {
  'use strict';

  angular.module('app.homePage', []);
})();

(function () {
  'use strict';

  angular.module('app.login', []);
})();

(function () {
  'use strict';

  angular.module('app.main', []);
})();

(function () {
  'use strict';

  angular.module('app.setting', []);
})();

(function () {
  'use strict';

  angular.module('app.userInfo', []);
})();

(function () {
  'use strict';

  angular.module('app.ECAson', []);
})();

(function () {
  'use strict';

  angular.module('app.tradeAndRegion', []);
})();

(function () {
  'use strict';

  angular.module('app.energyHistory', []);
})();

(function () {
  'use strict';

  angular
    .module('app.about')
    .controller('aboutController', aboutController);

  aboutController.$inject = ['$scope'];
  /** @ngInject */
  function aboutController($scope) {
    var vm = this;

    activate();

    ////////////////

    function activate() {
    }
  }
})();

(function () {
  'use strict';

  angular
    .module('app.about')
    .config(aboutConfig);

  aboutConfig.$inject = ['$stateProvider'];

  /** @ngInject */
  function aboutConfig($stateProvider) {
    $stateProvider
      .state('app.home.about', {
        url: '/about',
        views: {
          'about': {
            templateUrl: 'templates/about/about.html'
          }
        }
      });
  }
}());

(function () {
  'use strict';

  angular
    .module('app.about')
    .service('aboutService', aboutService);

  aboutService.$inject = ['$http'];
  /** @ngInject */
  function aboutService($http) {
    var service = {};

    return service;

    ////////////////
  }
})();

(function () {
  'use strict';

  angular
    .module('app.analyse')
    .controller('analyseController', analyseController);

  analyseController.$inject = ['$scope','analyseService'];
  /** @ngInject */
  function analyseController($scope,analyseService) {
    var vm = this;
    vm.listData = analyseService.getList();

    activate();

    ////////////////

    function activate() {
    }
  }
})();

(function () {
  'use strict';

  angular
    .module('app.analyse')
    .config(analyseConfig);

  analyseConfig.$inject = ['$stateProvider'];

  /** @ngInject */
  function analyseConfig($stateProvider) {
    $stateProvider
      .state('app.home.analyse', {
        url: '/analyse',
        views: {
          'analyse': {
            templateUrl: 'templates/analyse/analyse.html'
          }
        }
      });
  }
}());

(function () {
  'use strict';

  angular
    .module('app.analyse')
    .service('analyseService', analyseService);

  analyseService.$inject = ['$http'];
  /** @ngInject */
  function analyseService($http) {
    var service = {
      getList: getList
    };

    return service;


    function getList() {
          var listData = [{
            id: 0,
            name: '南昌市',
            lastText: '能源消费分析',
            face: 'img/nyxffx.png',
            url:'#/app/ECA/'
          }, {
            id: 1,
            name: '上饶市',
            lastText: '综合能耗分析',
            face: 'img/zhnhfx.png',
             url:'#/app/energyAnalyze//'
          }, {
            id: 2,
            name: '九江市',
            lastText: '耗能公式',
            face: 'img/hngs.png',
             url:'#/app/energyPublicity'
          }, {
            id: 3,
            name: '景德镇市',
            lastText: '节能量完成情况预警',
            face: 'img/jnlwcqkyj.png',
            url:'#/app/energysaving'
          }];

          return listData;
    }
    ////////////////
  }
})();
(function () {
  'use strict';

  angular
    .module('app.detail')
    .controller('detailController', detailController);

  detailController.$inject = ['$scope', '$stateParams', 'detailService'];
  /** @ngInject */
  function detailController($scope, $stateParams, detailService) {
    var vm = this;
    vm.detail = getDataDetail();

    activate();

    ////////////////

    function activate() {
    }

    function getDataDetail(){
      var id = $stateParams.id;
      return detailService.getDetail(id);
    }
  }
})();

(function () {
  'use strict';

  angular
    .module('app.detail')
    .config(detailConfig);

  detailConfig.$inject = ['$stateProvider'];

  /** @ngInject */
  function detailConfig($stateProvider) {
    $stateProvider
      .state('app.detail', {
        url: '/detail/:id',
        views: {
          'main-content': {
            templateUrl: 'templates/detail/detail.html'
          }
        }
      });
  }
}());

(function () {
  'use strict';

  angular
    .module('app.detail')
    .service('detailService', detailService);

  detailService.$inject = ['$http', 'SYS_INFO'];
  /** @ngInject */
  function detailService($http, SYS_INFO) {
    var service = {
      getDetail: getDetail
    };

    return service;

    ////////////////

    function getDetail(id){
      var listData = [{
        id: 0,
        name: 'Ben Sparrow',
        lastText: 'You on your way?',
        face: 'img/ben.png'
      }, {
        id: 1,
        name: 'Max Lynx',
        lastText: 'Hey, it\'s me',
        face: 'img/max.png'
      }, {
        id: 2,
        name: 'Adam Bradleyson',
        lastText: 'I should buy a boat',
        face: 'img/adam.jpg'
      }, {
        id: 3,
        name: 'Perry Governor',
        lastText: 'Look at my mukluks!',
        face: 'img/perry.png'
      }, {
        id: 4,
        name: 'Mike Harrington',
        lastText: 'This is wicked good ice cream.',
        face: 'img/mike.png'
      }];

      for (var i = 0; i < listData.length; i++) {
        if (listData[i].id === parseInt(id)) {
          return listData[i];
        }
      }
    }
  }
})();

(function () {
  'use strict';

  angular
    .module('app.ECA')
    .controller('ECAController', ECAController);

  ECAController.$inject = ['$scope','$ionicSlideBoxDelegate','$stateParams','$state'];
  /** @ngInject */
  function ECAController($scope,$ionicSlideBoxDelegate,$stateParams,$state) {
    var vm = this;
    var timeStatu=0;//0:月;1:年
    var flag=0;//0:全部;1:电力;2:原煤;3:天然气
    var pageIndex=0;//0:消费结构;1:消费量
    var dateType=0;//0:月;1:年
    var date='';//日期
/*    activate();

    ////////////////

    function activate() {
    }*/
    vm.showMonth=showMonth;
    vm.dChart={};
    vm.pChart={};
    vm.showMonthData=showMonthData;
    vm.tabXFL=tabXFL;
    vm.tab=tab;
    vm.slideChanged=slideChanged;
    vm.chartGlobalConfig = {
      theme: 'shine',
      dataLoaded: true
    };
    vm.sonPage=sonPage;
    vm.jump=jump;
    vm.isShowMonth=isShowMonth;
    vm.isShowYear=isShowYear;
    vm.yearItem=[{
      yearValue:"2016",
      yearLabel:"2016"
      },{
      yearValue:"2015",
      yearLabel:"2015"
      },{
      yearValue:"2014",
      yearLabel:"2014"
      },{
      yearValue:"2013",
      yearLabel:"2013"
      }];
    vm.timeTypeChange=timeTypeChange;
    vm.year="2016";
    vm.month="12";
    vm.type="月";
    ///////////////////////////////
    init();


    ////////////////////////////
    function init(){
      getData();
    }
    function showMonthData(){
      if (timeStatu==0) {
        return true;
      }
      else{
        return false;
      }
    };
    function tabXFL(parm){
      flag=parm;
      if (parm==0) {
        document.getElementById('tabXFL').className = 'tab-item active';
        document.getElementById('tabD').className = 'tab-item';
        document.getElementById('tabY').className = 'tab-item';
        document.getElementById('tabT').className = 'tab-item';
      }
      else if (parm==1) {
        document.getElementById('tabXFL').className = 'tab-item';
        document.getElementById('tabD').className = 'tab-item active';
        document.getElementById('tabY').className = 'tab-item';
        document.getElementById('tabT').className = 'tab-item';        
      }
      else if (parm==2) {
        document.getElementById('tabXFL').className = 'tab-item';
        document.getElementById('tabD').className = 'tab-item';
        document.getElementById('tabY').className = 'tab-item active';
        document.getElementById('tabT').className = 'tab-item';         
      }
      else if (parm==3) {
        document.getElementById('tabXFL').className = 'tab-item';
        document.getElementById('tabD').className = 'tab-item';
        document.getElementById('tabY').className = 'tab-item';
        document.getElementById('tabT').className = 'tab-item active';          
      }
    };
    function tab(parm){
      pageIndex=parm;
      if (parm==0) {
        document.getElementById('XFJG').className = 'tab-item active';
        document.getElementById('XFL').className = 'tab-item';
        $ionicSlideBoxDelegate.slide(pageIndex);
      }
      else if (parm==1) {
        document.getElementById('XFJG').className = 'tab-item';
        document.getElementById('XFL').className = 'tab-item active'; 
        $ionicSlideBoxDelegate.slide(pageIndex);
      }
    };
    function slideChanged(parm){
      pageIndex=parm;
      tab(pageIndex);
    };


    vm.dChart = builddChartOptions();
    vm.pChart = buildpChartOptions();
    function builddChartOptions(){
      var a='+15%';
      var dataOption={
        animation:false,
        title:{
          show:true,
          text:'全年累计能源消费总量\n\n\n\n万吨煤标\n'+'同比：'+a,
          subtext:'123987.45',
          x:'center',
          y:190,
          //正标题样式
          textStyle: {
            fontSize:20,
            fontFamily:'Arial',
            fontWeight:200,
            //color:'#1a4eb0',
          },
          //副标题样式
          subtextStyle: {
            fontSize:50,
            fontFamily:'Arial',
            color:"#1a4eb0"
          },
          itemGap:-95
        },
        color:['#97b653','#94726e','#dd6aaa','#2ac8c2','#ffb980','#d87b7f','#8c99b2','#e3d00d'],
        series : [{
          name:'全年累计能源消费总量',
          type : 'pie',
          center : ['50%', '50%'],//圆心坐标（div中的%比例）
          radius : ['60%','80%'],//半径
          x: '0%', // for funnel
          data : [
            {name:'热力', value:60},
            {name:'天然气', value:40},
            {name:'电力', value:60},
            {name:'焦炭', value:40},
            {name:'高炉煤气', value:60},
            {name:'原煤', value:40},
            {name:'原油', value:60},
            {name:'其他', value:40}
           ]
        }]
      };
      return dataOption;
    };
    function buildpChartOptions(){
      var dataOption={
        animation:false,
        color:['#97b653','#94726e','#dd6aaa','#2ac8c2','#ffb980','#d87b7f','#8c99b2','#e3d00d'],
        series:[{
          type:'pie',
          center:['50%','50%'],
          radius : ['20%','80%'],
          roseType:'area',
          data:[
            {name:'1月',value:201},
            {name:'2月',value:247},
            {name:'3月',value:251},
            {name:'4月',value:423},
            {name:'5月',value:333},
            {name:'6月',value:265},
            {name:'7月',value:131},
            {name:'8月',value:324},
            {name:'9月',value:212},
            {name:'10月',value:216},
            {name:'11月',value:315},
            {name:'12月',value:314}
          ]
        }]
      };
      return dataOption;
    };
    function sonPage(parm){
      //parm:0:消费量//parm:1:消费强度
      $state.go('app.ECAson', {'parm': parm});
    };
    function jump(){
      var path='app.ECA';
      $state.go('app.tradeAndRegion',{'parm':path});
    };
    function isShowYear(){
      if (dateType==0) {
        return false;
      }
      else if(dateType==1){
        return true;
      }
    };
    function isShowMonth(){
      if (dateType==0) {
        if (pageIndex==1) {
          return true;
        }
        return false;
      }
      else if (dateType==1) {
        return false;
      }
    };
    function showMonth(){
      if (dateType==0) {
        return true;
      }
      else if (dateType==1) {
        return false;
      }
    };
    function getData(){
      
    };
    function timeTypeChange(){
      var a=document.getElementById('timeType').value;
      if (a=="年") {
        dateType=0;
      }
      else if (a=="月") {
        dateType=1;
      }
      showMonth();
      isShowYear();
      isShowMonth();
    }
  }
})();

(function () {
  'use strict';

  angular
    .module('app.ECA')
    .config(ECAConfig);

  ECAConfig.$inject = ['$stateProvider'];

  /** @ngInject */
  function ECAConfig($stateProvider) {
    $stateProvider
      .state('app.ECA', {
        url: '/ECA/:parm',
        views: {
          'main-content': {
            templateUrl: 'templates/ECA/ECA.html'
          }
        }
      });
  }
}());

(function () {
  'use strict';

  angular
    .module('app.ECA')
    .service('ECAService', ECAService);

  ECAService.$inject = ['$http'];
  /** @ngInject */
  function ECAService($http) {
    var service = {};

    return service;

    ////////////////
  }
})();

(function () {
  'use strict';

  angular
    .module('app.ECAH')
    .controller('ECAHController', ECAHController);

  ECAHController.$inject = ['$scope','$ionicSlideBoxDelegate','$stateParams','$state'];
  /** @ngInject */
  function ECAHController($scope,$ionicSlideBoxDelegate,$stateParams,$state) {
    var vm = this;
    var timeStatu=0;//0:月;1:年
    var flag=0;//0:全部;1:电力;2:原煤;3:天然气
    var pageIndex=0;//0:消费结构;1:消费量
    var dateType=0;//0:月;1:年
    var date='';//日期
/*    activate();

    ////////////////

    function activate() {
    }*/
    vm.showMonth=showMonth;
    vm.dChart={};
    vm.pChart={};
    vm.showMonthData=showMonthData;
    vm.tabXFL=tabXFL;
    vm.tab=tab;
    vm.slideChanged=slideChanged;
    vm.chartGlobalConfig = {
      theme: 'shine',
      dataLoaded: true
    };
    vm.sonPage=sonPage;
    vm.jump=jump;
    vm.isShowMonth=isShowMonth;
    vm.isShowYear=isShowYear;
    vm.yearItem=[{
      yearValue:"2016",
      yearLabel:"2016"
      },{
      yearValue:"2015",
      yearLabel:"2015"
      },{
      yearValue:"2014",
      yearLabel:"2014"
      },{
      yearValue:"2013",
      yearLabel:"2013"
      }];
    vm.timeTypeChange=timeTypeChange;
    vm.year="2016";
    vm.month="12";
    vm.type="月";
    ///////////////////////////////
    init();


    ////////////////////////////
    function init(){
      getData();
    }
    function showMonthData(){
      if (timeStatu==0) {
        return true;
      }
      else{
        return false;
      }
    };
    function tabXFL(parm){
      flag=parm;
      if (parm==0) {
        document.getElementById('tabXFL').className = 'tab-item active';
        document.getElementById('tabD').className = 'tab-item';
        document.getElementById('tabY').className = 'tab-item';
        document.getElementById('tabT').className = 'tab-item';
      }
      else if (parm==1) {
        document.getElementById('tabXFL').className = 'tab-item';
        document.getElementById('tabD').className = 'tab-item active';
        document.getElementById('tabY').className = 'tab-item';
        document.getElementById('tabT').className = 'tab-item';        
      }
      else if (parm==2) {
        document.getElementById('tabXFL').className = 'tab-item';
        document.getElementById('tabD').className = 'tab-item';
        document.getElementById('tabY').className = 'tab-item active';
        document.getElementById('tabT').className = 'tab-item';         
      }
      else if (parm==3) {
        document.getElementById('tabXFL').className = 'tab-item';
        document.getElementById('tabD').className = 'tab-item';
        document.getElementById('tabY').className = 'tab-item';
        document.getElementById('tabT').className = 'tab-item active';          
      }
    };
    function tab(parm){
      pageIndex=parm;
      if (parm==0) {
        document.getElementById('XFJG').className = 'tab-item active';
        document.getElementById('XFL').className = 'tab-item';
        $ionicSlideBoxDelegate.slide(pageIndex);
      }
      else if (parm==1) {
        document.getElementById('XFJG').className = 'tab-item';
        document.getElementById('XFL').className = 'tab-item active'; 
        $ionicSlideBoxDelegate.slide(pageIndex);
      }
    };
    function slideChanged(parm){
      pageIndex=parm;
      tab(pageIndex);
    };


    vm.dChart = builddChartOptions();
    vm.pChart = buildpChartOptions();
    function builddChartOptions(){
      var a='+15%';
      var dataOption={
        animation:false,
        title:{
          show:true,
          text:'全年累计能源消费总量\n\n\n\n万吨煤标\n'+'同比：'+a,
          subtext:'123987.45',
          x:'center',
          y:190,
          //正标题样式
          textStyle: {
            fontSize:20,
            fontFamily:'Arial',
            fontWeight:200,
            //color:'#1a4eb0',
          },
          //副标题样式
          subtextStyle: {
            fontSize:50,
            fontFamily:'Arial',
            color:"#1a4eb0"
          },
          itemGap:-95
        },
        color:['#97b653','#94726e','#dd6aaa','#2ac8c2','#ffb980','#d87b7f','#8c99b2','#e3d00d'],
        series : [{
          name:'全年累计能源消费总量',
          type : 'pie',
          center : ['50%', '50%'],//圆心坐标（div中的%比例）
          radius : ['60%','80%'],//半径
          x: '0%', // for funnel
          data : [
            {name:'热力', value:60},
            {name:'天然气', value:40},
            {name:'电力', value:60},
            {name:'焦炭', value:40},
            {name:'高炉煤气', value:60},
            {name:'原煤', value:40},
            {name:'原油', value:60},
            {name:'其他', value:40}
           ]
        }]
      };
      return dataOption;
    };
    function buildpChartOptions(){
      var dataOption={
        animation:false,
        color:['#97b653','#94726e','#dd6aaa','#2ac8c2','#ffb980','#d87b7f','#8c99b2','#e3d00d'],
        series:[{
          type:'pie',
          center:['50%','50%'],
          radius : ['20%','80%'],
          roseType:'area',
          data:[
            {name:'1月',value:201},
            {name:'2月',value:247},
            {name:'3月',value:251},
            {name:'4月',value:423},
            {name:'5月',value:333},
            {name:'6月',value:265},
            {name:'7月',value:131},
            {name:'8月',value:324},
            {name:'9月',value:212},
            {name:'10月',value:216},
            {name:'11月',value:315},
            {name:'12月',value:314}
          ]
        }]
      };
      return dataOption;
    };
    function sonPage(parm){
      //parm:0:消费量//parm:1:消费强度
      $state.go('app.ECAson', {'parm': parm});
    };
    function jump(){
      var path='app.ECA';
      $state.go('app.tradeAndRegion',{'parm':path});
    };
    function isShowYear(){
      if (dateType==0) {
        return false;
      }
      else if(dateType==1){
        return true;
      }
    };
    function isShowMonth(){
      if (dateType==0) {
        if (pageIndex==1) {
          return true;
        }
        return false;
      }
      else if (dateType==1) {
        return false;
      }
    };
    function showMonth(){
      if (dateType==0) {
        return true;
      }
      else if (dateType==1) {
        return false;
      }
    };
    function getData(){
      
    };
    function timeTypeChange(){
      var a=document.getElementById('timeType').value;
      if (a=="年") {
        dateType=0;
      }
      else if (a=="月") {
        dateType=1;
      }
      showMonth();
      isShowYear();
      isShowMonth();
    }
  }
})();

(function () {
  'use strict';

  angular
    .module('app.ECAH')
    .config(ECAHConfig);

  ECAHConfig.$inject = ['$stateProvider'];

  /** @ngInject */
  function ECAHConfig($stateProvider) {
    $stateProvider
      .state('app.home.ECAH', {
        url: '/ECAH',
        views: {
          'ECAH': {
            templateUrl: 'templates/ECAH/ECAH.html'
          }
        }
      });
  }
}());

(function () {
  'use strict';

  angular
    .module('app.ECAH')
    .service('ECAHService', ECAHService);

  ECAHService.$inject = ['$http'];
  /** @ngInject */
  function ECAHService($http) {
    var service = {};

    return service;

    ////////////////
  }
})();

(function() {
    'use strict';
    angular.module('app.energyAnalyze').controller('energyAnalyzeController', energyAnalyzeController);
    energyAnalyzeController.$inject = ['$scope', 'energyAnalyzeService', '$ionicPopup','$ionicLoading','$location','$stateParams','$state'];
    /** @ngInject */
    function energyAnalyzeController($scope, energyAnalyzeService, $ionicPopup,$ionicLoading,$location,$stateParams,$state) {
        var vm = this;
        vm.lastMonth = 0;
        vm.wholeYear = 0;
        vm.predictYear = 0;
        vm.lastMonthYOY = 0;
        vm.lastMonthLRR = 0;
        // vm.wholeYearYOY = 0;
        vm.monthData = [];
        vm.theChart = {};
        vm.currentYear = moment().format("YYYY");

        vm.regin=$stateParams.regin;  //传参
        vm.trade=$stateParams.trade;

        vm.chartGlobalConfig = {
            theme: 'shine',
            dataLoaded: true
        };


        vm.jump=jump;
        vm.doRefresh = doRefresh;
        activate("","");
        ////////////////

        //////////////test
           function activate(regin,trade) {
                  var datas=energyAnalyzeService.test
                    vm.lastMonth = datas.lastMonth;
                    vm.wholeYear = datas.wholeYear;
                    vm.predictYear = datas.predictYear;
                    vm.lastMonthYOY = datas.lastMonthYOY;
                    vm.lastMonthLRR = datas.lastMonthLRR;
                    // vm.wholeYearYOY = datas.wholeYearYOY;
                    vm.monthData = datas.monthData;
                    var Series = [{
                        name: '本月指标',
                        type: 'bar',
                        data: vm.monthData[0],
                        barMaxWidth: 30,
                        itemStyle: {
                            normal: {
                                color: '#20aee5'
                            }
                        }
                    }, {
                        name: '去年同期',
                        type: 'bar',
                        data: vm.monthData[1],
                        barMaxWidth: 30,
                        itemStyle: {
                            normal: {
                                color: '#cdcdcd'
                            }
                        }
                    }, {
                        name: '变化率',
                        type: 'line',
                        data: vm.monthData[2],
                        barMaxWidth: 30,
                        itemStyle: {
                            normal: {
                                color: '#10bdbe'
                            }
                        }
                    }];
                    var LegendData = ['本月指标', '去年同期', '变化率'];
                    var label = ['1月', '2月', '3月', '4月', '5月', '6月'];
                    vm.theChart = buildTrendChartOptions(label, Series, LegendData);
        }



        ///////////////////testend


        // function activate(regin,trade) {
        //     energyAnalyzeService.getData(regin,trade).then(function(datas) {
        //         if (datas.failed) {
        //             $ionicPopup.alert({
        //                 title: '错误',
        //                 template: '数据读取失败'
        //             });
        //         } else {
        //             vm.lastMonth = datas.lastMonth;
        //             vm.wholeYear = datas.wholeYear;
        //             vm.predictYear = datas.predictYear;
        //             vm.lastMonthYOY = datas.lastMonthYOY;
        //             vm.lastMonthLRR = datas.lastMonthLRR;
        //             // vm.wholeYearYOY = datas.wholeYearYOY;
        //             vm.monthData = datas.monthData;
        //             var Series = [{
        //                 name: '本月指标',
        //                 type: 'bar',
        //                 data: vm.monthData[0],
        //                 barMaxWidth: 30,
        //                 itemStyle: {
        //                     normal: {
        //                         color: '#20aee5'
        //                     }
        //                 }
        //             }, {
        //                 name: '去年同期',
        //                 type: 'bar',
        //                 data: vm.monthData[1],
        //                 barMaxWidth: 30,
        //                 itemStyle: {
        //                     normal: {
        //                         color: '#cdcdcd'
        //                     }
        //                 }
        //             }, {
        //                 name: '变化率',
        //                 type: 'line',
        //                 data: vm.monthData[2],
        //                 barMaxWidth: 30,
        //                 itemStyle: {
        //                     normal: {
        //                         color: '#10bdbe'
        //                     }
        //                 }
        //             }];
        //             var LegendData = ['本月指标', '去年同期', '变化率'];
        //             var label = ['1月', '2月', '3月', '4月', '5月', '6月'];
        //             vm.theChart = buildTrendChartOptions(label, Series, LegendData);
        //         }
        //     });
        // }

        function doRefresh() {
            activate();
            $scope.$broadcast('scroll.refreshComplete');
        }
         function show() {
            $ionicLoading.show({
                template: '正在加载数据，请稍候...'
            });
        }

        function hide() {
            $ionicLoading.hide();
        }

         function jump(){
      var path='app.energyAnalyze';
      $state.go('app.tradeAndRegion',{'parm':path});
    };

        function buildTrendChartOptions(xAxisData, seriesData, legendData) {
            var dataSet = {
                grid: {
                    top: 10,
                    left: '3%',
                    right: '4%',
                    bottom: '10%',
                    containLabel: true
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    }
                },
                legend: {
                    bottom: -6,
                    right: 20,
                    show: true,
                    data: legendData,
                },
                calculable: true,
                xAxis: [{
                    type: 'category',
                    data: xAxisData,
                    axisTick: {
                        alignWithLabel: true
                    }
                    // axisLabel: {
                    //  interval: interval,
                    //    formatter: function (value, index) {
                    //     return new moment(value).format(format);
                    //        }
                    //       }
                }],
                yAxis: [{
                    axisLine: {
                        show: false
                    },
                    axisTick: {
                        show: false
                    },
                    type: 'value',
                    // scale: true
                }],
                series: seriesData
            };
            return dataSet;
        }
    }
})();
(function () {
  'use strict';

  angular
    .module('app.energyAnalyze')
    .config(energyAnalyzeConfig);

  energyAnalyzeConfig.$inject = ['$stateProvider'];

  /** @ngInject */
  function energyAnalyzeConfig($stateProvider) {
    $stateProvider
      .state('app.energyAnalyze', {
        url: '/energyAnalyze/{regin}/{trade}',
        views: {
          'main-content': {
            templateUrl: 'templates/energyAnalyze/energyAnalyze.html'
          }
        }
      });
  }
}());

(function() {
    'use strict';
    angular.module('app.energyAnalyze').service('energyAnalyzeService', energyAnalyzeService);
    energyAnalyzeService.$inject = ['$http'];
    /** @ngInject */
    function energyAnalyzeService($http) {
        var service = {
            //////////test
            test:test(),
            /////////////
            getData:getData
        };
        return service;
        ////////////////////////////////

         /////////test


        function test(){
   var datas={
     monthData: [ [1, 2, 2, 4, 5, 3],[2, 3, 2, 3, 4, 2],[1, 2, 1, 2, 1, 2],["1月","2月","3月","4月","5月","6月"]
    ],
    lastMonth: 3323.56,
    wholeYear: 9343.89,
    predictYear: 32.89,
    lastMonthYOY: -12.23,
    lastMonthLRR: 9.02,
    wholeYearYOY: 3235.7
};
return datas

   
}



        //////test



     
           function getData(regin,trade) {
            return $http({
                    url: 'http://localhost:8100/templates/energyAnalyze/data.json'
                })
                .then(getDataComplete)
                .catch(getAvengersFailed);
        }

        function getDataComplete(response) {
            return response.data;
        }

        function getAvengersFailed() {
            var result = {
                failed: true
            };
            return result;
        }
    }
    ////////////////
})();
(function() {
    'use strict';
    angular.module('app.energyPublicity').controller('energyPublicityController', energyPublicityController);
    energyPublicityController.$inject = ['$scope', 'energyPublicityService', '$ionicPopup', '$timeout', '$ionicLoading'];
    /** @ngInject */
    function energyPublicityController($scope, energyPublicityService, $ionicPopup, $timeout, $ionicLoading) {
        var vm = this;

        getIndexList();
        vm.indexId = "index1"; //改成综合能耗Id
        vm.timeType = "month";
        vm.indexName = "综合能耗";
        vm.currentType = "月";
        vm.choose = 'area';
        vm.indexUnit = "吨标煤",
        vm.totalValue = 0;
        vm.totalValueYOY = 0;
        vm.totalValueLRR = 0;
        vm.areaValueList = [];
        vm.tradeValueListTop6 = [];
        vm.tradeValueListLast6 = [];
        vm.theChart = {};
        vm.theChart2 = {};
        vm.areaData = [];
        /////
        vm.bardatas=[];
        vm.bardatas2=[];
        vm.barData=[];

        vm.chartGlobalConfig = {
            theme: 'shine',
            dataLoaded: true
        };
        vm.timeList = energyPublicityService.getTimeList;
        ///////
        vm.doRefresh = doRefresh;
        vm.areaChange = areaChange;
        vm.tradeChange = tradeChange;
        vm.changeIndex = changeData;
        vm.changeType = changeData;

        /////////////////////////////////test
        function activate() {
            ///// 函数
                 areaChange();
                   var datas= energyPublicityService.dataResult;
                    vm.totalValue = datas.totalValue;
                    // dataConfig(datas,'totalValue');
                    vm.totalValueYOY = datas.totalValueYOY;
                    vm.totalValueLRR = datas.totalValueLRR;
                    vm.areaValueList = datas.areaValueList;
                    vm.tradeValueListTop6 = datas.tradeValueListTop6;
                    vm.tradeValueListLast6 = datas.tradeValueListLast6;
                   var label = ['行业1', '行业2', '行业3', '行业4', '行业5', '行业6'];
                      var max = _.max(vm.tradeValueListTop6[0]);
                    vm.bardatas = [];
                    _.forEach(label, function(item, index) {
                        var value =  filterNumber(vm.tradeValueListTop6[0][index]) ;
                        vm.bardatas.push({
                            name: label[index],
                            value: vm.tradeValueListTop6[0][index],
                            value2: vm.tradeValueListTop6[1][index],
                            width: (parseInt(value / max / 1.1 * 95) + '%'),
                        });
                    });

                    var label2 = ['行业1', '行业2', '行业3', '行业4', '行业5', '行业6'];
                    var max2 = _.max(vm.tradeValueListLast6[0]);
                    vm.bardatas2 = [];
                    _.forEach(label2, function(item, index) {
                        var value =  filterNumber(vm.tradeValueListLast6[0][index]) ;
                        vm.bardatas2.push({
                            name: label2[index],
                            value: vm.tradeValueListLast6[0][index],
                            value2: vm.tradeValueListLast6[1][index],
                            width: (parseInt(value / max2 / 1.1 * 95) + '%'),
                        });
                    });

                    vm.barData=[{text:"前",data:vm.bardatas,color:"bar-style-blue"},
                    {text:"后",data:vm.bardatas2,color:"bar-style-red"}
                            ];

                    var label = ['行业1', '行业2', '行业3', '行业4', '行业5', '行业6'];
                    vm.theChart = buildBarOptions(label, vm.tradeValueListTop6[0]);
                    var label = ['行业11', '行业12', '行业13', '行业14', '行业15', '行业16'];
                    vm.theChart2 = buildBarOptions(label, vm.tradeValueListTop6[1]);
                    vm.areaData = [{
                        area: "地区1",
                        value: 123.3,
                        ratio: '10%',
                        order: 2,
                        orderChange: -1
                    }, {
                        area: "地区2",
                        value: 123.3,
                        ratio: '10%',
                        order: 1,
                        orderChange: 1
                    }, {
                        area: "地区3",
                        value: 123.3,
                        ratio: '10%',
                        order: 3,
                        orderChange: 2
                    }, {
                        area: "地区1",
                        value: 123.3,
                        ratio: '10%',
                        order: 2,
                        orderChange: -1
                    }, {
                        area: "地区2",
                        value: 123.3,
                        ratio: '10%',
                        order: 1,
                        orderChange: 1
                    }, {
                        area: "地区3",
                        value: 123.3,
                        ratio: '10%',
                        order: 3,
                        orderChange: 2
                    }];
                }
      
        function getIndexList() {
                    vm.indexList = energyPublicityService.indexList;
                    for (var i = 0; i < vm.indexList.length; i++) {
                        if (vm.indexList[i].indexId == vm.indexId) {
                            vm.indexUnit = vm.indexList[i].indexUnit;
                            vm.indexName = vm.indexList[i].indexName;
                            vm.indexUnit = vm.indexList[i].indexUnit;
                        }
                    }
        }

        /////////////////////////test end 



        activate();
        ////////////////
        // function activate() {
        //     ///// 函数
        //     show();
        //     areaChange();
        //     energyPublicityService.getData(vm.indexId, vm.timeType).then(function(datas) {
        //         if (datas.failed) {
        //             $ionicPopup.alert({
        //                 title: '错误',
        //                 template: '数据读取失败'
        //             });
        //         } else {
        //             vm.totalValue = datas.totalValue;
        //             // dataConfig(datas,'totalValue');
        //             vm.totalValueYOY = datas.totalValueYOY;
        //             vm.totalValueLRR = datas.totalValueLRR;
        //             vm.areaValueList = datas.areaValueList;
        //             vm.tradeValueListTop6 = datas.tradeValueListTop6;
        //             vm.tradeValueListLast6 = datas.tradeValueListLast6;

           
        //               ///////////////////////////test
        //            var label = ['行业1', '行业2', '行业3', '行业4', '行业5', '行业6'];
        //               var max = _.max(vm.tradeValueListTop6[0]);
        //             vm.bardatas = [];
        //             _.forEach(label, function(item, index) {
        //                 var value =  filterNumber(vm.tradeValueListTop6[0][index]) ;
        //                 vm.bardatas.push({
        //                     name: label[index],
        //                     value: vm.tradeValueListTop6[0][index],
        //                     value2: vm.tradeValueListTop6[1][index],
        //                     width: (parseInt(value / max / 1.1 * 95) + '%'),
        //                 });
        //             });

        //             var label2 = ['行业1', '行业2', '行业3', '行业4', '行业5', '行业6'];
        //             var max2 = _.max(vm.tradeValueListLast6[0]);
        //             vm.bardatas2 = [];
        //             _.forEach(label2, function(item, index) {
        //                 var value =  filterNumber(vm.tradeValueListLast6[0][index]) ;
        //                 vm.bardatas2.push({
        //                     name: label2[index],
        //                     value: vm.tradeValueListLast6[0][index],
        //                     value2: vm.tradeValueListLast6[1][index],
        //                     width: (parseInt(value / max2 / 1.1 * 95) + '%'),
        //                 });
        //             });


        //             vm.barData=[{text:"前",data:vm.bardatas,color:"bar-style-blue"},
        //             {text:"后",data:vm.bardatas2,color:"bar-style-red"}
        //                     ];
        //             ////////////////////////////
        //             var label = ['行业1', '行业2', '行业3', '行业4', '行业5', '行业6'];
        //             vm.theChart = buildBarOptions(label, vm.tradeValueListTop6[0]);
        //             var label = ['行业11', '行业12', '行业13', '行业14', '行业15', '行业16'];
        //             vm.theChart2 = buildBarOptions(label, vm.tradeValueListTop6[1]);
        //             vm.areaData = [{
        //                 area: "地区1",
        //                 value: 123.3,
        //                 ratio: '10%',
        //                 order: 2,
        //                 orderChange: -1
        //             }, {
        //                 area: "地区2",
        //                 value: 123.3,
        //                 ratio: '10%',
        //                 order: 1,
        //                 orderChange: 1
        //             }, {
        //                 area: "地区3",
        //                 value: 123.3,
        //                 ratio: '10%',
        //                 order: 3,
        //                 orderChange: 2
        //             }, {
        //                 area: "地区1",
        //                 value: 123.3,
        //                 ratio: '10%',
        //                 order: 2,
        //                 orderChange: -1
        //             }, {
        //                 area: "地区2",
        //                 value: 123.3,
        //                 ratio: '10%',
        //                 order: 1,
        //                 orderChange: 1
        //             }, {
        //                 area: "地区3",
        //                 value: 123.3,
        //                 ratio: '10%',
        //                 order: 3,
        //                 orderChange: 2
        //             }];
        //         }
        //     });
        //     hide();
        // }

        function doRefresh() {
            console.info("aaaaa");
            activate();
            $scope.$broadcast('scroll.refreshComplete');
        }

        // function getIndexList() {
        //     energyPublicityService.getIndexList().then(function(datas) {
        //         if (datas.failed) {
        //             $ionicPopup.alert({
        //                 title: '错误',
        //                 template: '数据读取失败'
        //             });
        //         } else {
        //             vm.indexList = datas.indexList;
        //             for (var i = 0; i < datas.indexList.length; i++) {
        //                 if (datas.indexList[i].indexId == vm.indexId) {
        //                     vm.indexUnit = datas.indexList[i].indexUnit;
        //                     vm.indexName = datas.indexList[i].indexName;
        //                     vm.indexUnit = datas.indexList[i].indexUnit;
        //                 }
        //             }
        //         }
        //     });
        // }

        function changeData() {
            activate();
            vm.currentType = getIndexName(document.getElementById('typeSelect'));
            getIndexList();
        }

        function  getIndexName(select)  {  
            var  options  =  select  &&  select.options;  
            var  opt;   
            for  (var  i = 0,  iLen = options.length;  i < iLen;  i++)  {    
                opt  =  options[i];     
                if  (opt.selected)  {
                    return  opt.text;    
                }  
            }  
            return  "";
        }

        function areaChange() {
            document.getElementById("diqu").style.display = "inline";
            document.getElementById("hangye").style.display = "none";
            vm.choose = "area";
        }

        function tradeChange() {
            document.getElementById("diqu").style.display = "none";
            document.getElementById("hangye").style.display = "inline";
            vm.choose = "trade";
        }
        ////////////List转化成数组
        function dataConfig(data, index) {
            var n = data.length;
            var result = new Array(n);
            for (var i = 0; i < n; i++) {
                result[i] = data[i][index];
            }
            return result;
        }

        function show() {
            $ionicLoading.show({
                template: '正在加载数据，请稍候...'
            });
        }

        function hide() {
            $ionicLoading.hide();
        }

        function buildBarOptions(yAxis, data) {
            var dataSet = {
                // legend: {
                //     top: 'top',
                //     right: 'right',
                //     data: [' ']
                // },
                grid: {
                    top: '5%',
                    left: '3%',
                    right: '4%',
                    bottom: '5%',
                    containLabel: true
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    }
                },
                calculable: true,
                yAxis: [{
                    type: 'category',
                    boundaryGap: true,
                    axisTick: {
                        interval: 'auto',
                        alignWithLabel: true
                    },
                    //  axisLabel: {
                    //  formatter: function (value, index) {
                    //     return new moment(value).format("YYYY年");
                    //  }
                    // },
                    data: yAxis //纵坐标显示
                }],
                xAxis: [{
                    type: 'value',
                    // scale: true,
                }],
                series: [{
                    type: 'bar',
                    name: '指标值', //显示文字
                    label: {
                        normal: {
                            position: 'right',
                            show: true,
                            formatter: function(value) {
                                return "(" + value.data + "," + filterNumber(value.data / vm.totalValue * 100) + "%)";
                            }
                        }
                    },
                    itemStyle: {
                        normal: {
                            color: '#b0c8d7'
                        }
                    },
                    // barWidth: 8,
                    data: data //数据
                }]
            };
            return dataSet;
        }

        function filterNumber(data) {
            if (data && data !== 0 && data !== 'NaN') {
                return data.toFixed(2);
            }
            return 0;
        }
    }
})();
(function () {
  'use strict';

  angular
    .module('app.energyPublicity')
    .config(energyPublicityConfig);

  energyPublicityConfig.$inject = ['$stateProvider'];

  /** @ngInject */
  function energyPublicityConfig($stateProvider) {
    $stateProvider
      .state('app.energyPublicity', {
        url: '/energyPublicity',
        views: {
          'main-content': {
            templateUrl: 'templates/energyPublicity/energyPublicity.html'
          }
        }
      });
  }
}());

(function() {
    'use strict';
    angular.module('app.energyPublicity').service('energyPublicityService', energyPublicityService);
    energyPublicityService.$inject = ['$http'];
    /** @ngInject */
    function energyPublicityService($http) {
        var service = {

            //////test
             indexList:indexList(),
             dataResult:dataResult(),
            ////// test end


            getTimeList: getTimeList(),
            getIndexList: getIndexList,
            getData: getData


        };
        return service;
        ////////////////////////////////

        ////////////////////////////test
         function indexList(){
             var datas=[{
                "indexId": "index1",
               "indexName":"综合能耗",
               "indexUnit":"吨标煤"
            }, {
                "indexId": "index2",
                "indexName": "指标2",
                "indexUnit":"千米"
            }, {
                "indexId": "index3",
                "indexName":"指标3",
                "indexUnit":"克"
            }];
            return datas;

         }
          function dataResult(){
             var datas={
    areaValueList:[
                    [1, 2, 2, 4, 5, 3],
                    [2, 3, 2, 3, 4, 2],
                    [1, 2, 1, 2, 1, 2],
                    [2, 2, 2, 2, 2, 2],
                    [3, 3, 3, 3, 3, 3],
                    ["1月", "2月", "3月", "4月", "5月", "6月"]
                ],
     tradeValueListTop6: [
                    [2.2, 3.5, 4.22, 4.78, 5.83, 3.74],
                    [7.33, 16.3, 53.4, 44.4, 33.5, 21.1]
                ],
     tradeValueListLast6: [
                    [1.4, 3.3, 3.4, 6.43, 6.32, 7.52],
                    [4.23, 65.66, 30.4, 25.4, 12.5, 11.4]
                ],
    totalValue: 12.43,
    totalValueYOY: -12.3,
    totalValueLRR: 24.5
  
}
            return datas;

         }


        /////////////////////////testend
        function getTimeList() {
            var data = [{
                id: 'month',
                name: '' + '月'
            }, {
                id: 'quarter',
                name: '' + '季'
            }, {
                id: 'year',
                name: '' + '年'
            }];
            return data;
          
        }

        function getIndexList() {
            return $http({
                    url: 'http://localhost:8100/templates/energyPublicity/list.json'
                })
                .then(getDataComplete)
                .catch(getAvengersFailed);
        }

        function getData(indexId,timeType) {
           
            return $http({
                    url: 'http://localhost:8100/templates/energyPublicity/data.json'
                })
                .then(getDataComplete)
                .catch(getAvengersFailed);
        }

        function getDataComplete(response) {
            return response.data;
        }

        function getAvengersFailed() {
            var result = {
                failed: true
            };
            return result;
        }
    }
    ////////////////
})();
(function () {
  'use strict';

  angular
    .module('app.energysaving')
    .config(analyseConfig);

  analyseConfig.$inject = ['$stateProvider'];

  /** @ngInject */
  function analyseConfig($stateProvider) {
    $stateProvider
      .state('app.energysaving', {
        url: '/energysaving',
        views: {
          'main-content': {
            templateUrl: 'templates/energysaving/energysaving.html'
          }
        }
      });
    /* $stateProvider
      .state('app.energysaving', {
        url: '/energysaving',
        views: {
          'main-content': {
            templateUrl: 'templates/energysaving/energysaving.html'
          }
        }
      });*/
    }
}());

(function () {
  'use strict';

  angular
    .module('app.energysaving')
    .controller('energysavingController', energysavingController);

  energysavingController.$inject = ['$scope','energysavingService'];
  /** @ngInject */
  function energysavingController($scope,energysavingService) {
    var vm = this;
    var is_year=0;
    var pageIndex=0;
    vm.text=chargeYear();
    vm.tab=tab;
    vm.slideChanged=slideChanged;
    vm.listData = energysavingService.getList();
    vm.dChartThisYear={};
    vm.dChartFiveYear={};
    vm.zzt={};
    vm.dChartThisYear=initChartThisYear(is_year,true);
    vm.dChartFiveYear=initChartThisYear(is_year,false);
    vm.zzt=initZzt();
    vm.userInfo=userInfo();
    vm.jump=jump();
    vm.chartGlobalConfig = {
        theme: 'shine',
        dataLoaded: true
      };
    activate();

    ////////////////

    function activate() {
    }

    function chargeYear(){
      var now = new Date();
      var year= now.getFullYear();
      // var year=2021;
      var text='';
      if(year>=2016&&year<=2020){
          text='十三五节能量完成情况';
      }else{
        text='十四五节能量完成情况';
      }
      return text;
    }

     function tab(parm){
      is_year=parm
      if (parm==0) {
        document.getElementById('this_year').className = 'tab-item active';
        document.getElementById('five_year').className = 'tab-item';
        // $ionicSlideBoxDelegate.slide(pageIndex);
        vm.dChartThisYear=initChartThisYear(is_year,true);
        vm.dChartFiveYear=initChartThisYear(is_year,false);

      }
      else if (parm==1) {
        document.getElementById('this_year').className = 'tab-item';
        document.getElementById('five_year').className = 'tab-item active'; 
        // $ionicSlideBoxDelegate.slide(pageIndex);
        vm.dChartThisYear=initChartThisYear(is_year,true);
        vm.dChartFiveYear=initChartThisYear(is_year,false);
      }
      
    };

    function slideChanged(parm){
        pageIndex=parm;
        tab(pageIndex);
    }

    function initChartThisYear(is_year,this_year){
        var option={};
        var color=[];
        var completed_energysaving=60;
        var completed_ratio='60%';
        var task_energysaving=50;
        var task_ratio='50%';
        var target_energysaving=100;
        var value_little=0;
        var value_total=0;
        var title='';
        var title_color='';
        if(this_year){
            color=['#8e98ba','#cfd7da'];
            value_little=completed_energysaving;
            value_total=target_energysaving-completed_energysaving;
            title=completed_ratio;
            title_color='#374b7b';
        }else{
            color=['#2ec3c9', '#b2e5e1'];
            value_little=task_energysaving;
            value_total=target_energysaving-task_energysaving;
            title=task_ratio;
            title_color='#0b6665'
        }
        if(is_year==0){
            option = {
                legend:{show:false},
                backgroundColor: '#ffffff',
                title: {
                    text: title,
                    subtext:'累计完成节能量\n'+value_little,
                    // left: 'center',
                    x:'center',
                    y:'25%',
                    textStyle: {
                        color: title_color,
                        fontSize:'55'
                    },
                    subtextStyle:{
                        color: '#4d4d4d',
                        fontSize:'22'
                    }
                },
                series : [
                    {
                        name:'访问来源',
                        type:'pie',
                        radius : ['75%', '90%'],
                        center: ['50%', '40%'],
                        label:{
                            normal:{show:false},
                        },
                        data:[
                            {value:value_little, name:''},
                            {value:value_total,name:''}
                        ],
                    }
                ],
                color:color
            };            
        }else{
            option = {
                legend:{show:false},
                backgroundColor: '#ffffff',
                title: {
                    text: title,
                    subtext:'累计完成节能\n'+value_little,
                    // left: 'center',
                    x:'center',
                    y:'25%',
                    textStyle: {
                        color: title_color,
                        fontSize:'55'
                    },
                    subtextStyle:{
                        color: '#4d4d4d',
                        fontSize:'22'
                    }
                },
                series : [
                    {
                        name:'访问来源',
                        type:'pie',
                        radius : ['75%', '90%'],
                        center: ['50%', '40%'],
                        label:{
                            normal:{show:false},
                        },
                        data:[
                            {value:value_little, name:''},
                            {value:value_total,name:''}
                        ],
                    }
                ],
                color:color
            };
        }
        return option;
    }

    function userInfo(){

    }

    function jump(){
        
    }

    function initZzt(){
        var option={};
        option = {
            
            legend: {
                
            },
            xAxis: {
               axisLabel:{
                     textStyle:{
                         color:"#00b9ed"
                     }
                 }
            },
            yAxis: {
                type: 'category',
                data: [""],
                axisLabel:{
                     textStyle:{
                         color:"#00b9ed"
                     }
                 }
            },
            series: [{
                name: '',
                type: 'bar',
                barWidth:'10',
                data: [5]
            }]
        };
        /*var option={
                animation:false,
                xAxis:[{
                    type:'category',
                    axisTick: {
                        alignWithLabel: true
                    },
                    data:["1月","2月","3月","4月","5月","6月","7月"]                   
                }],
                yAxis: [{
                    type: 'value',
                    // scale: true
                }],
                series : [{
                        type: 'bar',
                        data: [264,342,213,243,342,123,422],
                        itemStyle: {
                            normal: {
                                color: '#20aee5'
                            }
                        }
                },{
                        type: 'bar',
                        data: [234,312,113,303,212,223,322],
                        itemStyle: {
                            normal: {
                                color: '#20aee5'
                            }
                        }                   
                }]
            };*/
        return option;
    }

  }
})();

(function () {
  'use strict';

  angular
    .module('app.energysaving')
    .service('energysavingService', energysavingService);

  energysavingService.$inject = ['$http'];
  /** @ngInject */
  function energysavingService($http) {
    var service = {
      getList: getList
    };

    return service;

    function getList() {
          var listData = [{
            id: 0,
            name: '南昌市',
            lastText: 'You on your way?',
            face: 'img/alarming.png',
            percent:'20%'
          }, {
            id: 1,
            name: '上饶市',
            lastText: 'Hey, it\'s me',
            face: 'img/alarming.png',
            percent:'0%'
          }, {
            id: 2,
            name: '九江市',
            lastText: 'I should buy a boat',
            face: 'img/alarming.png',
            percent:'80%',
          }, {
            id: 3,
            name: '景德镇市',
            lastText: 'Look at my mukluks!',
            face: 'img/alarming.png',
            percent:'30%',
          }, {
            id: 4,
            name: '新余市',
            lastText: 'This is wicked good ice cream.',
            face: 'img/alarming.png',
            percent:'100%'
          }];

          return listData;
    }
    ////////////////
  }
})();
(function () {
    'use strict';

    angular
        .module('app.ESA')
        .controller('ESAController', ESAController);

    ESAController.$inject = ['$scope','$ionicSlideBoxDelegate','$state','$stateParams'];
    /** @ngInject */
    function ESAController($scope,$ionicSlideBoxDelegate,$state,$stateParams) {
        var vm = this;
        ///////////////////////////////////////
        vm.chartGlobalConfig = {
            theme: 'shine',
            dataLoaded: true
        };
        vm.pieChart={};
        vm.pieChart=pieChartBuilder();
        /////////////////////////////////////////
        function pieChartBuilder(){
            var option={
                animation:false,
                color:['#c23432','#2f4455','#63a0a5','#d48365','#93c8ae'],
                series : [{
                    type : 'pie',
                    center : ['50%', '50%'],//圆心坐标（div中的%比例）
                    data : [
                        {name:'0%-20%', value:60},
                        {name:'20%-40%', value:40},
                        {name:'40%-60%', value:60},
                        {name:'60%-80%', value:40},
                        {name:'80%-100%', value:60}
                    ]
                }]                
            };
            return option;
        }
    }
})();

(function () {
  'use strict';

  angular
    .module('app.ESA')
    .config(ESAConfig);

  ESAConfig.$inject = ['$stateProvider'];

  /** @ngInject */
  function ESAConfig($stateProvider) {
    $stateProvider
      .state('app.ESA', {
        url: '/ESA/:parm',
        views: {
          'main-content':{
            templateUrl: 'templates/ESA/ESA.html'
          }
        }
      });
  }
}());

(function () {
  'use strict';

  angular
    .module('app.ESA')
    .service('ESAService', ESAService);

  ESAService.$inject = ['$http'];
  /** @ngInject */
  function ESAService($http) {
    var service = {};

    return service;

    ////////////////
  }
})();

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
    vm.userInfo = userInfo;
    vm.user = Session.UserInfo.userName;
    vm.goECA=goECA;
    activate();

    ////////////////

    function activate() {
    }

    function userInfo() {
      $state.go('app.userInfo');
    }
    function goECA(){
      var parm={
        type:'region',
        id:'all'
      };
      $state.go('app.home.ECA',{'parm':parm});
    }
  }
})();

(function () {
  'use strict';

  angular.module('app.home')
    .config(homeRouteConfig);

  homeRouteConfig.$inject = ['$stateProvider'];

  function homeRouteConfig($stateProvider) {
    $stateProvider
      .state('app.home', {
        url: '/home',
        views: {
          'main-content': {
            templateUrl: 'templates/home/home.html'
          }
        }
      });
  }
})();

(function () {
  'use strict';

  angular
    .module('app.home')
    .factory('homeService', homeService);

  homeService.$inject = ['$http', 'SYS_INFO', 'Session'];

  function homeService($http, SYS_INFO, Session) {
    var service = {};

    return service;

    ////////////////
  }
})();

(function () {
  'use strict';

  angular
    .module('app.homePage')
    .controller('homePageController', homePageController);

  homePageController.$inject = ['$scope', 'homePageService'];
  /** @ngInject */
  function homePageController($scope, homePageService) {
    var vm = this;
    vm.listData = homePageService.getList();

    activate();

    ////////////////

    function activate() {
    }
  }
})();

(function () {
  'use strict';

  angular
    .module('app.homePage')
    .config(homePageConfig);

  homePageConfig.$inject = ['$stateProvider'];

  /** @ngInject */
  function homePageConfig($stateProvider) {
    $stateProvider
      .state('app.home.homePage', {
        url: '/homePage',
        views: {
          'homePage': {
            templateUrl: 'templates/homePage/homePage.html'
          }
        }
      });
  }
}());

(function () {
  'use strict';

  angular
    .module('app.homePage')
    .service('homePageService', homePageService);

  homePageService.$inject = ['$http'];
  /** @ngInject */
  function homePageService($http) {
    var service = {
      getList: getList
    };

    return service;

    ////////////////

    function getList() {
      var listData = [{
        id: 0,
        name: 'Ben Sparrow',
        lastText: 'You on your way?',
        face: 'img/ben.png'
      }, {
        id: 1,
        name: 'Max Lynx',
        lastText: 'Hey, it\'s me',
        face: 'img/max.png'
      }, {
        id: 2,
        name: 'Adam Bradleyson',
        lastText: 'I should buy a boat',
        face: 'img/adam.jpg'
      }, {
        id: 3,
        name: 'Perry Governor',
        lastText: 'Look at my mukluks!',
        face: 'img/perry.png'
      }, {
        id: 4,
        name: 'Mike Harrington',
        lastText: 'This is wicked good ice cream.',
        face: 'img/mike.png'
      }];

      return listData;
    }
  }
})();

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
      loginService.login(vm.username, hex_md5(vm.password))
        .then(function (data) {
          $ionicLoading.hide();
          if (data.failed) {
            $ionicPopup.alert({
              title: '登陆失败',
              template: data.msg
            }).then(function (res) {
            });
          } else {
            $timeout(function () {
              Session.create(data.msg);
            }, 100).then(function () {
              $state.go('app.home.ECAH');
            });
          }
        });
    }
  }
})();

(function () {
  angular.module('app.login')
    .config(loginRouteConfig);

  loginRouteConfig.$inject = ['$stateProvider'];

  function loginRouteConfig($stateProvider) {
    $stateProvider
      .state('login', {
        url: '/login',
        templateUrl: 'templates/login/login.html'
      });
  }
})();

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
      isAuthenticated: isAuthenticated
    };

    return service;

    ////////////////

    function create(info) {
      var userInfo = {
        userId: '',
        userName: ''
      };

      if (info) {
        userInfo.userId = info.userId;
        userInfo.userName = info.userName;
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
    var service = {
      login: login
    };

    return service;

    // //////////////
    function login(userName, pwd) {
      return $http.get(SYS_INFO.SERVER_PATH + '/auth/login/' + userName + '/' + pwd)
        .then(loginComplete)
        .catch(loginFailed);
    }

    function loginComplete(response) {
      return response.data;
    }

    function loginFailed() {
      var result = {
        failed: false
      };

      return result;
    }
  }
})();

(function () {
  'use strict';

  angular
    .module('app.main')
    .controller('MainController', MainController);

  MainController.$inject = [
    '$scope',
    '$ionicHistory'
  ];

  function MainController($scope, $ionicHistory) {
    var vm = this;
    vm.goBack = goBack;

    activate();

    ////////////////

    function activate() {
    }

    function goBack() {
      $ionicHistory.goBack();
    }
  }
})();

(function () {
  'use strict';

  angular
    .module('app.main')
    .config(mainConfig);

  /** @ngInject */
  function mainConfig($stateProvider) {
    $stateProvider
      .state('app', {
        url: '/app',
        templateUrl: 'templates/mainContent/main.html'
      });
  }
}());

(function () {
  'use strict';

  angular
    .module('app.setting')
    .controller('settingController', settingController);

  settingController.$inject = ['$scope', 'settingService'];
  /** @ngInject */
  function settingController($scope, settingService) {
    var vm = this;
    vm.enabled = true;

    activate();

    ////////////////

    function activate() {
    }
  }
})();

(function () {
  'use strict';

  angular
    .module('app.setting')
    .config(settingConfig);

  settingConfig.$inject = ['$stateProvider'];

  /** @ngInject */
  function settingConfig($stateProvider) {
    $stateProvider
      .state('app.home.setting', {
        url: '/setting',
        views: {
          'setting': {
            templateUrl: 'templates/setting/setting.html'
          }
        }
      });
  }
}());

(function () {
  'use strict';

  angular
    .module('app.setting')
    .service('settingService', settingService);

  settingService.$inject = ['$http', 'SYS_INFO'];
  /** @ngInject */
  function settingService($http, SYS_INFO) {
    var service = {};

    return service;

    ////////////////
  }
})();

(function () {
  'use strict';

  angular
    .module('app.userInfo')
    .controller('userInfoController', userInfoController);

  userInfoController.$inject = ['$scope'];
  /** @ngInject */
  function userInfoController($scope) {
    var vm = this;

    activate();

    ////////////////

    function activate() {
    }
  }
})();

(function () {
  'use strict';

  angular
    .module('app.userInfo')
    .config(userInfoConfig);

  userInfoConfig.$inject = ['$stateProvider'];

  /** @ngInject */
  function userInfoConfig($stateProvider) {
    $stateProvider
      .state('app.userInfo', {
        url: '/userInfo',
        views: {
          'main-content': {
            templateUrl: 'templates/userInfo/userInfo.html'
          }
        }
      });
  }
}());

(function () {
  'use strict';

  angular
    .module('app.userInfo')
    .service('userInfoService', userInfoService);

  userInfoService.$inject = ['$http'];
  /** @ngInject */
  function userInfoService($http) {
    var service = {};

    return service;

    ////////////////
  }
})();

(function () {
    'use strict';

    angular
        .module('app.ECAson')
        .controller('ECAsonController', ECAsonController);

    ECAsonController.$inject = ['$scope','$ionicSlideBoxDelegate','$state','$stateParams'];
    /** @ngInject */
    function ECAsonController($scope,$ionicSlideBoxDelegate,$state,$stateParams) {
        var vm = this;
        ///////////////////////////////////////
        vm.lChart={};
        vm.bChart={};
        vm.back=back;
        vm.chartGlobalConfig = {
            theme: 'shine',
            dataLoaded: true
        };
        vm.type="";
        vm.type=type();
        //////////////////////////////////////////
        //////////////////////////////////////////
        vm.lChart=buildlChart();
        vm.bChart=buildbChart();
        function buildlChart(){
        	var dataOption={
        		animation:false,
        		xAxis:[{
        			type:'category',
                    axisTick: {
                        alignWithLabel: true
                    },
                    data:["1月","2月","3月","4月","5月","6月","7月"]                   
        		}],
                yAxis: [{
                    type: 'value',
                    // scale: true
                }],
        		series : [{
                        type: 'bar',
                        data: [264,342,213,243,342,123,422],
                        itemStyle: {
                            normal: {
                                color: '#20aee5'
                            }
                        }
        		},{
                        type: 'bar',
                        data: [234,312,113,303,212,223,322],
                        itemStyle: {
                            normal: {
                                color: '#20aee5'
                            }
                        }        			
        		}]
        	};
        	return dataOption;
        };
        function buildbChart(){
        	var dataOption={
        		animation:false,
        		xAxis:[{
        			type:'category',
                    axisTick: {
                        alignWithLabel: true
                    },
                    data:["2016","2017","2018","2019","2020"]                   
        		}],
                yAxis: [{
                    type: 'value',
                    // scale: true
                }],
        		series : [{
                        type: 'bar',
                        data: [264,342,213,243,342],
                        itemStyle: {
                            normal: {
                                color: '#20aee5'
                            }
                        }
        		}]
        	};
        	return dataOption;
        };
        function back(){
        	$state.go('app.ECA');
        };
        function type(){
        	var type;
        	if ($stateParams.parm==0) {
        		type="能源消费量";
        	}
        	else if ($stateParams.parm==1) {
        		type="能源消费强度";
        	}
        	return type;
        };
    }
})();

(function () {
  'use strict';

  angular
    .module('app.ECAson')
    .config(ECAsonConfig);

  ECAsonConfig.$inject = ['$stateProvider'];

  /** @ngInject */
  function ECAsonConfig($stateProvider) {
    $stateProvider
      .state('app.ECAson', {
        url: '/ECAson/:parm',
        views: {
          'main-content':{
            templateUrl: 'templates/ECA/ECAson/ECAson.html'
          }
        }
      });
  }
}());

(function () {
  'use strict';

  angular
    .module('app.ECAson')
    .service('ECAsonService', ECAsonService);

  ECAsonService.$inject = ['$http'];
  /** @ngInject */
  function ECAsonService($http) {
    var service = {};

    return service;

    ////////////////
  }
})();

(function () {
    'use strict';

    angular
        .module('app.tradeAndRegion')
        .controller('tradeAndRegionController', tradeAndRegionController);

    tradeAndRegionController.$inject = ['$scope','$ionicSlideBoxDelegate','$state','$stateParams'];
    /** @ngInject */
    function tradeAndRegionController($scope,$ionicSlideBoxDelegate,$state,$stateParams ) {
    	var vm=this;
    	var pageIndex=0;
    	var parms={
    		path:$stateParams.parm,
    		type:'',
    		name:'',
    		id:''
    	};
    	//0:区域;1:行业
    	///////////////////////////
    	vm.back=back;
    	vm.tab=tab;
    	vm.slideChanged=slideChanged;
    	///////////////////////////
    	function tab(parm){
    		//parm:0:区域;1:行业
    		pageIndex=parm;
            if (parm==0) {
              document.getElementById('region').className = 'tab-item active';
              document.getElementById('trade').className = 'tab-item';
              $ionicSlideBoxDelegate.slide(pageIndex);
            }
            else if (parm==1) {
              document.getElementById('region').className = 'tab-item';
              document.getElementById('trade').className = 'tab-item active'; 
              $ionicSlideBoxDelegate.slide(pageIndex);
            }    		
    	};
    	function slideChanged(parm){
    		pageIndex=parm;
    		tab(pageIndex);
    	}
    	function back(){
    		$state.go(parms.path,{'parm':parms});
    	};
    }
})();

(function () {
  'use strict';

  angular
    .module('app.tradeAndRegion')
    .config(tradeAndRegionConfig);

  tradeAndRegionConfig.$inject = ['$stateProvider'];

  /** @ngInject */
  function tradeAndRegionConfig($stateProvider) {
    $stateProvider
      .state('app.tradeAndRegion', {
        url: '/tradeAndRegion/:parm',
        views: {
          'main-content':{
            templateUrl: 'templates/ECA/tradeAndRegion/tradeAndRegion.html'
          }
        }
      });
  }
}());

(function () {
  'use strict';

  angular
    .module('app.tradeAndRegion')
    .service('tradeAndRegionService', tradeAndRegionService);

  tradeAndRegionService.$inject = ['$http'];
  /** @ngInject */
  function tradeAndRegionService($http) {
    var service = {};

    return service;

    ////////////////
  }
})();

(function() {
    'use strict';
    angular.module('app.energyHistory').controller('energyHistoryController', energyHistoryController);
    energyHistoryController.$inject = ['$scope', 'energyHistoryService', '$ionicPopup','$ionicLoading','$location','$stateParams'];
    /** @ngInject */
    function energyHistoryController($scope, energyHistoryService, $ionicPopup,$ionicLoading,$location,$stateParams) {
        var vm = this;

        vm.totalValue = 0;
        vm.totalValueYOY = 0;
        vm.totalAver = 0;
        vm.maxValue = 0;
        vm.minValue = 0;
        vm.averValue = 0;
        vm.totalValueList = [];
        vm.historyChart = {};

        vm.regin=$stateParams.regin;  //传参
        vm.trade=$stateParams.trade;

        vm.chartGlobalConfig = {
            theme: 'shine',
            dataLoaded: true
        };
        ////////
        vm.doRefresh = doRefresh;
        activate("","");
         
         ///////////////////////
        
        /////////////////////tesrt=t
           function activate(regin,trade) {
                   var datas= energyHistoryService.test();
                    vm.totalValue = datas.totalValue;
                    vm.totalValueYOY = datas.totalValueYOY;
                    vm.totalAver = datas.totalAver;
                    vm.maxValue = datas.maxValue;
                    vm.minValue = datas.minValue;
                    vm.averValue = datas.averValue;
                    vm.totalValueList = datas.totalValueList;
                    var Series = [{
                        name: '指标值',
                        type: 'bar',
                        data: vm.totalValueList[0],
                        barWidth: 30, //设置柱宽
                        itemStyle: {
                            normal: {
                                color: '#20aee5'
                            }
                        }
                    }];
                    var LegendData = ['综合能耗'];
                    var label = ['2011年', '2012年', '2013年', '2014年', '2015年'];
                    vm.historyChart = buildTrendChartOptions(label, Series, LegendData);
        }

        ////////////////////teat end




        // function activate(regin,trade) {
        //     energyHistoryService.getData(regin,trade).then(function(datas) {
        //         if (datas.failed) {
        //             $ionicPopup.alert({
        //                 title: '错误',
        //                 template: '数据读取失败'
        //             });
        //         } else {
        //             vm.totalValue = datas.totalValue;
        //             vm.totalValueYOY = datas.totalValueYOY;
        //             vm.totalAver = datas.totalAver;
        //             vm.maxValue = datas.maxValue;
        //             vm.minValue = datas.minValue;
        //             vm.averValue = datas.averValue;
        //             vm.totalValueList = datas.totalValueList;
        //             var Series = [{
        //                 name: '指标值',
        //                 type: 'bar',
        //                 data: vm.totalValueList[0],
        //                 barWidth: 30, //设置柱宽
        //                 itemStyle: {
        //                     normal: {
        //                         color: '#20aee5'
        //                     }
        //                 }
        //             }];
        //             var LegendData = ['综合能耗'];
        //             var label = ['2011年', '2012年', '2013年', '2014年', '2015年'];
        //             vm.historyChart = buildTrendChartOptions(label, Series, LegendData);
        //         }
        //     });
        // }

        function doRefresh() {
            show();
            console.info("aaaaa");
            activate();
            $scope.$broadcast('scroll.refreshComplete');
            hide();
        }

         function show() {
            $ionicLoading.show({
                template: '正在加载数据，请稍候...'
            });
        }

        function hide() {
            $ionicLoading.hide();
        }

        function buildTrendChartOptions(xAxisData, seriesData, legendData) {
            var dataSet = {
                grid: {
                    top: 10,
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true,
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    }
                },
                legend: {
                    show: true,
                    data: legendData,
                    right: 10
                },
                calculable: true,
                xAxis: [{
                    type: 'category',
                    data: xAxisData,
                    axisTick: {
                        alignWithLabel: true
                    }
                    // axisLabel: {
                    //  interval: interval,
                    //    formatter: function (value, index) {
                    //     return new moment(value).format(format);
                    //        }
                    //       }
                }],
                yAxis: [{
                    axisLine: {
                        show: false
                    },
                    axisTick: {
                        show: false
                    },
                    type: 'value',
                    // scale: true
                }],
                series: seriesData
            };
            return dataSet;
        }
    }
})();
(function () {
  'use strict';

  angular
    .module('app.energyHistory')
    .config(energyHistoryConfig);

  energyHistoryConfig.$inject = ['$stateProvider'];

  /** @ngInject */
  function energyHistoryConfig($stateProvider) {
    $stateProvider
      .state('app.energyHistory', {
        url: '/energyHistory/{regin}/{trade}',
        views: {
          'main-content': {
            templateUrl: 'templates/energyAnalyze/energyHistory/energyHistory.html'
          }
        }
      });
  }
}());

(function() {
    'use strict';
    angular.module('app.energyHistory').service('energyHistoryService', energyHistoryService);
    energyHistoryService.$inject = ['$http'];
    /** @ngInject */
    function energyHistoryService($http) {
        var service = {
            //////////test
            test:test,
            //////////////testend
            getData: getData
        };
        return service;
        ////////////////////////////////

        ////////////////////test
        function test(){
           var datas= {
    totalValueList: [
        [
            1,
            2,
            2,
            4,
            5
        ]
    ],
    totalValue: 12.43,
    totalValueYOY: -32.46,
    totalAver: 879.904,
    maxValue: 8232.456,
    minValue: 121.345,
    averValue: 323.6
}
      return datas;
        }

        ///////////////////

        function getData(regin,trade) {
            return $http({
                    url: 'http://localhost:8100/templates/energyAnalyze/energyHistory/data.json'
                })
                .then(getDataComplete)
                .catch(getAvengersFailed);
        }

        function getDataComplete(response) {
            return response.data;
        }

        function getAvengersFailed() {
            var result = {
                failed: true
            };
            return result;
        }
    }
    ////////////////
})();