(function () {
    'use strict'
    angular.module('app.consumptionSearch').controller('consumptionSearchController', consumptionSearchController)
    consumptionSearchController.$inject = ['$rootScope', '$scope', 'consumptionSearchService', '$ionicPopup', '$timeout', 'MonthPicker', '$stateParams', '$ionicLoading', '$state']
    /** @ngInject */
    function consumptionSearchController($rootScope, $scope, consumptionSearchService, $ionicPopup, $timeout, MonthPicker, $stateParams, $ionicLoading, $state) {
        var vm = this;
        vm.judgeName = '';
        vm.currentDate = moment().subtract(1, 'months').format('YYYY年MM月');
        // 需要返回到上一页面的数据Obj
        vm.selectObj = {
            indexId: '',
            indexName: '',
            indexType: '',
            timeType: 'month',
            time: moment().subtract(1, 'months').format('YYYY-MM') + '-01'//组装时间格式为xxxx-xx-01
        };
        // 设置时间选择控件的格式
        vm.calenderInitObj = {
            minMonthIndex: 1,
            minYear: 1900,
            maxMonth: new Date().getMonth(),
            maxYear: 2100,
            startingYear: new Date().getFullYear(),
            monthLabels: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
            title: '选择时间',
            cancelText: '取消',
            cancelClass: 'button-assertive'
        };
        vm.indexList = [];
        vm.showAreaEnterprise = true; // 在非模糊查询企业时，显示地区和企业列表
        vm.showMatchingEnterprise = false; // 在模糊查询企业时，该值为true，显示模糊查询到的企业列表，同时隐藏掉地区和企业列表
        vm.enterpriseName = '';
        vm.localStorageEnterpriseList = [];
        vm.listData = [];
        vm.matchingEnterpriseList = [];
        vm.fun = {
            matchingEnterprise: matchingEnterprise,
            open: open,
            showcalender: showcalender,
            confirm: confirm,
            sendData: sendData
        };
        // ////
        // 获取页面的数据
        activated();
        ////////////
        function activated(){
            initPageData();
            getPageData();
        }
        /**
         * 初始化界面中的各种数据
         */
        function initPageData(){
            console.log($stateParams);
            if($stateParams.indexId){
                vm.selectObj.indexId = $stateParams.indexId;
            }
            if($stateParams.indexName){
                vm.selectObj.indexName = $stateParams.indexName;
            }
            if($stateParams.indexType){
                vm.selectObj.indexType = $stateParams.indexType;
            }
            MonthPicker.init(vm.calenderInitObj)
        }
        /**
         * 通过访问服务器获取数据
         */
        function getPageData() {
            $rootScope.showLoadingDialog()
            getEnterpriseList();
        }

        /**
         * 显示日期控件
         */
        function showcalender() {
            MonthPicker.show(function (res) {
                if (res) {
                    switch (res.condition) {
                        case 'year':
                            vm.currentDate = res.year + '年';
                            vm.selectObj.timeType = 'year';
                            vm.selectObj.time = res.year + '-01-01';
                            break;
                        case 'month':
                            vm.currentDate = res.year + '年' + (res.month + 1) + '月';
                            vm.selectObj.timeType = 'month';
                            if(res.month<9){
                                vm.selectObj.time = res.year + '-' + '0' + (res.month + 1) + '-01';
                            }else{
                                vm.selectObj.time = res.year + '-' + (res.month + 1) + '-01';
                            }
                            break;
                        default:
                            break;
                    }
                }
            })
        }

        /**
         * 模糊查询某个企业
         */
        function matchingEnterprise() {
            var copName = document.getElementById('enterpriseName').value;
            filtResult(copName);
        }

        /**
         *展开列表
         */
        function open(item) {
            if(!item.isTitle){
                switch(item.type){
                    case 'area':
                        vm.selectObj.indexId = item.name;
                        vm.selectObj.indexName = item.name;
                        vm.selectObj.indexType = 'area';
                        break;
                    case 'enterprise':
                        vm.selectObj.indexId = item.enterpriseId;
                        vm.selectObj.indexName = item.name;
                        vm.selectObj.indexType = 'enterprise';
                        break;
                    default:
                        break;        
                }
                vm.judgeName = item.name;
                console.log(vm.indexName);
                return;
            }
            var param = item.areaId;
            var dom = document.getElementsByName(param);
            var domNumber = dom.length;
            if (dom[1].style.display == 'none') {
                dom[0].getElementsByTagName('i')[0].className = 'icon ion-chevron-up';
            } else {
                dom[0].getElementsByTagName('i')[0].className = 'icon ion-chevron-down';
            }
            for (var i = 1; i < domNumber; i++) {
                if (dom[i].style.display == 'none') {
                    dom[i].style.display = 'block';
                    // dom[i].getElementsByTagName('a')[0].style.backgroundColor = '#e8ede9';
                    dom[i].getElementsByTagName('i')[0].className = '';
                } else {
                    dom[i].style.display = 'none';
                }
            }
        }

        /**
         * 获取企业的相关数据
         */
        function getEnterpriseList() {
            $rootScope.showLoadingDialog()
            consumptionSearchService.getEnterpriseTree().then(function (datas) {
                $rootScope.hideLoadingDialog();
                console.log(datas);
                datas = JSON.parse(datas);
                if (datas.failed) {
                    $ionicPopup.alert({
                        title: '提示',
                        template: datas.msg
                    })
                } else {
                    //由于从服务器获取到的json没有齐齐哈尔市这个字段，所以要添加一下
                    var qiQiHaErObj = {
                        name:"齐齐哈尔市",
                        enterprise:[]
                    }
                    datas.data.unshift(qiQiHaErObj);
                    ////////////
                    var enterpriseJsonArray = datas.data;
                    var listData = [];
                    for (var i = 0; i < enterpriseJsonArray.length; i++) {
                        var areaData = {
                            areaId: '',
                            type: '',
                            name: '',
                            display: '',
                            fontColor: '',
                            paddingLeft: '',
                            isTitle: true
                        }
                        areaData.areaId = 'area' + i;
                        areaData.type = 'area';
                        areaData.name = enterpriseJsonArray[i].name;
                        areaData.display = 'block';
                        areaData.fontColor = '#65A54F';
                        areaData.paddingLeft = 5;
                        listData.push(areaData);
                        var areaDataChild = {
                            areaId: '',
                            type: '',
                            name: '',
                            display: '',
                            fontColor: '',
                            paddingLeft: '',
                            isTitle: false
                        }
                        areaDataChild.areaId = 'area' + i;
                        areaDataChild.type = 'area';
                        areaDataChild.name = enterpriseJsonArray[i].name;
                        areaDataChild.display = 'none';
                        areaDataChild.fontColor = '#333333';
                        areaDataChild.paddingLeft = 15;
                        listData.push(areaDataChild);
                        for (var j = 0; j < enterpriseJsonArray[i].enterprise.length; j++) {
                            var enterpriseData = {
                                areaId: '',
                                enterpriseId: '',
                                type: '',
                                name: '',
                                display: '',
                                fontColor: '',
                                paddingLeft: '',
                                isTitle: false
                            }
                            enterpriseData.areaId = 'area' + i;
                            enterpriseData.type = 'enterprise';
                            enterpriseData.enterpriseId = enterpriseJsonArray[i].enterprise[j].DepartId;
                            enterpriseData.name = enterpriseJsonArray[i].enterprise[j].Name;
                            enterpriseData.display = 'none';
                            enterpriseData.fontColor = '#333333';
                            enterpriseData.paddingLeft = 15;
                            listData.push(enterpriseData);
                        }
                    }
                    vm.listData = listData;
                }
            })
        }

        /**
         * 模糊搜索企业
         * @param keyWord 
         */
        function filtResult(keyWord) {
            if (keyWord == '') {
                vm.showAreaEnterprise = true;
                vm.showMatchingEnterprise = false;
            } else {
                vm.showAreaEnterprise = false;
                vm.showMatchingEnterprise = true;
                vm.matchingEnterpriseList = [];
                for (var i in vm.listData) {
                    var name = vm.listData[i].name;
                    var isTitle = vm.listData[i].isTitle;
                    if (name.indexOf(keyWord) >= 0 && !isTitle) {
                        vm.matchingEnterpriseList.push(vm.listData[i])
                    }
                }
            }
        }

        /**
         * 产值单耗搜索页面
         */
        function confirm(){
            $state.go('consumption',{sendData: vm.selectObj});
        }

        /**
         * 传值给产值单耗页面
         * @param item 
         */
        function sendData(item){
            if(!item.isTitle){
                switch(item.type){
                    case 'area':
                        vm.selectObj.indexId = item.name;
                        vm.selectObj.indexName = item.name;
                        vm.selectObj.indexType = 'area';
                        break;
                    case 'enterprise':
                        vm.selectObj.indexId = item.enterpriseId;
                        vm.selectObj.indexName = item.name;
                        vm.selectObj.indexType = 'enterprise';
                        break;
                    default:
                        break;        
                }
                $state.go('outputUnitConsumption',{sendData: vm.selectObj});
            }
        }
    }
})();