(function () {
    'use strict';

    angular
        .module('app.news')
        .controller('newsController', newsController);


    newsController.$inject = ['$rootScope', '$scope', '$ionicSlideBoxDelegate', '$stateParams', '$state', 'newsService', '$timeout', '$ionicPopup', '$ionicLoading'];
    /** @ngInject */

    function newsController($rootScope, $scope, $ionicSlideBoxDelegate, $stateParams, $state, newsService, $timeout, $ionicPopup, $ionicLoading) {
        var vm = this;
        var sendParm = 0;//0：节能技术，1：节能案例
        vm.searchShow = false;//点击查询的时候弹出查询的页面
        vm.searchNewsName = '';//输入的要模糊查询的新闻的名字
        vm.searchNewsList = [];//模糊搜索完成的新闻List
        vm.slideImgPathList = ['assets/global/img/a.png', 'assets/global/img/b.png'];
        vm.tecNews = [];//节能技术新闻的List
        vm.news = [];//技能案例新闻的List
        vm.fun = {
            chooseContent: chooseContent,
            download: download,
            toNewsContent: toNewsContent,
            search: search,
            matchingNews: matchingNews,
            clickBack: clickBack,
            doRefresh: doRefresh
        }
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

        }
        /**
         * 从后台获取页面所需要的数据 
         */
        function getPageData() {
            $ionicLoading.show({
                templateUrl: 'templates/common/html/loading.html'
            });
            newsService.getPageData(0)
                .then(function (datas) {
                    console.log(datas);
                    datas = JSON.parse(datas);
                    if (datas.failed) {
                        $ionicLoading.hide();
                        $rootScope.showAlert(datas.msg);
                    }
                    else {
                        vm.tecNews = datas.Table;
                        newsService.getPageData(1).then(function(datas){
                            $ionicLoading.hide();
                            datas = JSON.parse(datas);
                            if (datas.failed) {
                                $rootScope.showAlert(datas.msg);
                            }else{
                                vm.news = datas.Table;
                            }
                        });
                    }
                });
        }
        /**
         * 点击新闻列表跳转到新闻内容详情的页面
         */
        function toNewsContent(id) {
            switch (sendParm) {
                case 0:
                    $state.go('newsContent', { 'id': id, 'title': '节能技术' });
                    break;
                case 1:
                    $state.go('newsContent', { id: id, title: '节能案例' });
                    break;
                default:
                    break;
            }
        }
        /**
         * 切换Tab
         * @param {*} parm 
         */
        function chooseContent(parm) {
            if (parm == 0) {
                document.getElementById('JNJS').className = 'tab-item common-tab-item active';
                document.getElementById('JNAL').className = 'tab-item common-tab-item';
                sendParm = 0;
            }
            else if (parm == 1) {
                document.getElementById('JNJS').className = 'tab-item common-tab-item';
                document.getElementById('JNAL').className = 'tab-item common-tab-item active';
                sendParm = 1;
            }
            $ionicSlideBoxDelegate.$getByHandle('content').slide(parm);
        };
        /**
         * 根据关键字查询相关的新闻
         */
        function search() {
            if(vm.searchShow){
                return;
            }else{
                vm.searchShow = true;
                vm.searchNewsName = '';
                vm.searchNewsList = [];
            }
        }
        /**
         * 点击返回按钮时，如果是搜索页面，那么就隐藏搜索页面，如果不是模糊搜索页面，那么就返回到上一页。
         */
        function clickBack() {
            if (vm.searchShow) {
                vm.searchShow = false;
            } else {
                $state.go('home.about');
            }
        }
        /**
         * 下拉刷新
         */
        function doRefresh(){
            getPageData();
            $scope.$broadcast('scroll.refreshComplete');
        }
        /**
         * 模糊匹配 
         */
        function matchingNews() {
            if (vm.searchNewsName) {
                vm.searchNewsList = [];
                console.log(vm.searchNewsName);
                for (var i in vm.tecNews) {
                    if (vm.tecNews[i].title.indexOf(vm.searchNewsName) >= 0) {
                        vm.searchNewsList.push(vm.tecNews[i]);
                    }
                }
                for (var i in vm.news) {
                    if (vm.news[i].title.indexOf(vm.searchNewsName) >= 0) {
                        vm.searchNewsList.push(vm.news[i]);
                    }
                }
            } else {
                vm.searchNewsList = [];
            }

        }
        /**
         * 下载附件
         * @param {*} location 
         * @param {*} title 
         */
        function download(location, title) {
            var Url = encodeURI(location);
            var path;
            window.resolveLocalFileSystemURL(cordova.file.externalRootDirectory, function (fileEntry) {
                fileEntry.getDirectory("appGXDownload", { create: true, exclusive: false }, function (fileEntry) {
                    var fileTransfer = new FileTransfer();
                    fileTransfer.download(Url, fileEntry.toInternalURL() + title + '.pdf', function (entry) {
                        $ionicPopup.alert({
                            title: '文件已下载',
                            template: '文件已下载至' + fileEntry.toInternalURL()
                        });
                        path = '文件已下载至' + fileEntry.toInternalURL();
                    }, function (err) {
                        $ionicPopup.alert({
                            title: '文件已下载失败',
                            template: '文件已下载失败'
                        });
                    }, true);
                }, function () { alert("创建文件夹失败") });
            });
        }

        $timeout(function () {
            $ionicSlideBoxDelegate.$getByHandle('content').enableSlide(false);
        })
    }
})();
