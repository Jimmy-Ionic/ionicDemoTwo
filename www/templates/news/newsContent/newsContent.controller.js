(function () {
    'use strict';

    angular
        .module('app.newsContent')
        .controller('newsContentController', newsContentController);


    newsContentController.$inject = ['$ionicLoading', '$rootScope', '$scope', '$ionicSlideBoxDelegate', '$stateParams', '$state', 'newsContentService', '$timeout', '$ionicPopup'];
    /** @ngInject */

    function newsContentController($ionicLoading, $rootScope, $scope, $ionicSlideBoxDelegate, $stateParams, $state, newsContentService, $timeout, $ionicPopup) {
        var vm = this;
        vm.title = '';
        vm.newsId = '';
        vm.newsContent = {};
        ////////////
        activated();
        ///////////
        function activated() {
            initPageData();
            getPageData();
        }
        /**
         * 初始化页面需要的各种配置信息或者数据
         */
        function initPageData() {
            console.log($stateParams);
            if ($stateParams.id) {
                vm.newsId = $stateParams.id;
            }
            if ($stateParams.title) {
                vm.title = $stateParams.title;
            }
        }
        /**
         * 从后台获取页面所需要的数据 
         */
        function getPageData() {
            $ionicLoading.show({
                templateUrl: 'templates/common/html/loading.html'
            });
            newsContentService.getPageData(vm.newsId)
                .then(function (datas) {
                    $ionicLoading.hide();
                    console.log(datas);
                    datas = JSON.parse(datas);
                    if (datas.failed) {
                        $rootScope.showAlert(datas.msg);
                    }
                    else {
                        vm.newsContent = datas;
                    }
                });
        }

    }
})();
