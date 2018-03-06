(function () {
    'use strict';

    angular
    .module('app.calculator')
    .controller('calculatorController', calculatorController);

    calculatorController.$inject = ['$scope','$state','$timeout','$ionicPopup'];
    function calculatorController($scope,$state,$timeout,$ionicPopup) {
        var vm = this;
        var resize_width=window.screen.width;
        var scale=resize_width/640;
        vm.scalenum=scale;
        var cssList=['new-naviBar','new-button-back','new-content'];
        var index=0;
        var elec=0;
        var coal=0;
        var gas=0;
        var oil=0;
        var coalGas=0;
        vm.clickK=clickK;
        vm.clickG=clickG;
        vm.clickC=clickC;
        vm.clickO=clickO;
        vm.clickE=clickE;
        vm.isShowK=isShowK;
        vm.isShowG=isShowG;
        vm.isShowC=isShowC;
        vm.isShowO=isShowO;
        vm.isShowE=isShowE;
        vm.tip='用电量';
        vm.unit='千瓦时';
        vm.calculate=calculate;
        vm.sum=0;
        function clickK(){
            index=4;//煤气
            document.getElementById('K').style.backgroundColor='#64a64f';
            document.getElementById('G').style.backgroundColor='#0b5182';
            document.getElementById('C').style.backgroundColor='#0b5182';
            document.getElementById('O').style.backgroundColor='#0b5182';
            document.getElementById('E').style.backgroundColor='#0b5182';
            changeTip();
        };
        function clickG(){
            index=2;//天然气
            document.getElementById('K').style.backgroundColor='#0b5182';
            document.getElementById('G').style.backgroundColor='#64a64f';
            document.getElementById('C').style.backgroundColor='#0b5182';
            document.getElementById('O').style.backgroundColor='#0b5182';
            document.getElementById('E').style.backgroundColor='#0b5182';
            changeTip();
        };
        function clickC(){
            index=1;//煤
            document.getElementById('K').style.backgroundColor='#0b5182';
            document.getElementById('G').style.backgroundColor='#0b5182';
            document.getElementById('C').style.backgroundColor='#64a64f';
            document.getElementById('O').style.backgroundColor='#0b5182';
            document.getElementById('E').style.backgroundColor='#0b5182';
            changeTip();
        };
        function clickO(){
            index=3;//油
            document.getElementById('K').style.backgroundColor='#0b5182';
            document.getElementById('G').style.backgroundColor='#0b5182';
            document.getElementById('C').style.backgroundColor='#0b5182';
            document.getElementById('O').style.backgroundColor='#64a64f';
            document.getElementById('E').style.backgroundColor='#0b5182';
            changeTip();
        };
        function clickE(){
            index=0;//电
            document.getElementById('K').style.backgroundColor='#0b5182';
            document.getElementById('G').style.backgroundColor='#0b5182';
            document.getElementById('C').style.backgroundColor='#0b5182';
            document.getElementById('O').style.backgroundColor='#0b5182';
            document.getElementById('E').style.backgroundColor='#64a64f';
            changeTip();
        };
        function changeTip(){
            document.getElementById('calculateValue').value=0;
            document.getElementById('calculateValue').innerHTML=0;
            if (index==0) {
                vm.tip='用电量';
                vm.unit='千瓦时';
            }
            else if (index==1) {
                vm.tip='用煤量';
                vm.unit='吨';
            }
            else if (index==2) {
                vm.tip='天然气';
                vm.unit='立方米';
            }
            else if (index==3) {
                vm.tip='用油量';
                vm.unit='吨';
            }
            else if (index==4) {
                vm.tip='煤气量';
                vm.unit='立方米';
            }
        }
        function calculate(){
            if (document.getElementById('calculateValue').value<0) {
                 $ionicPopup.alert({
                    title: '提示',
                    template: '请输入一个大于0的值'
                })  
            }
            else{
                if (index==0) {
                    elec=(document.getElementById('calculateValue').value*0.785).toFixed(2);
                    vm.E=elec;
                }
                else if (index==1) {
                    coal=(document.getElementById('calculateValue').value*2620).toFixed(2);
                    vm.C=coal;
                }
                else if (index==2) {
                    gas=(document.getElementById('calculateValue').value*1.76).toFixed(2);
                    vm.G=gas;
                }
                else if (index==3) {
                    oil=(document.getElementById('calculateValue').value*3360).toFixed(2);
                    vm.O=oil;
                }
                else if (index==4) {
                    coalGas=(document.getElementById('calculateValue').value*0.72).toFixed(2);
                    vm.K=coalGas;
                }
                vm.sum=(parseFloat(elec)+parseFloat(coal)+parseFloat(gas)+parseFloat(oil)+parseFloat(coalGas)).toFixed(2);
            }
        }
        function isShowK(){
            if (coalGas==0) {
                return false;
            }
            else{
                return true;
            }
        }
        function isShowE(){
            if (elec==0) {
                return false;
            }
            else{
                return true;
            }
        }
        function isShowC(){
            if (coal==0) {
                return false;
            }
            else{
                return true;
            }
        }
        function isShowG(){
            if (gas==0) {
                return false;
            }
            else{
                return true;
            }
        }
        function isShowO(){
            if (oil==0) {
                return false;
            }
            else{
                return true;
            }
        }















        function resize(){ 
                for (var i = 0; i < cssList.length; i++) {
                    var propr=document.getElementsByClassName(cssList[i]);
                    if (cssList[i]=="new-content") {
                        for (var j = 0; j < propr.length; j++) {
                            propr[j].style.marginTop=window.getComputedStyle(propr[j]).marginTop.replace('px','')*scale+'px';
                        }
                    }
                    else{
                        for (var j = 0; j < propr.length; j++) {
                            propr[j].style.height=window.getComputedStyle(propr[j]).height.replace('px','')*scale+'px';
                            propr[j].style.fontSize=window.getComputedStyle(propr[j]).fontSize.replace('px','')*scale+'px';
                            propr[j].style.lineHeight=window.getComputedStyle(propr[j]).lineHeight.replace('px','')*scale+'px';
                            propr[j].style.paddingTop=window.getComputedStyle(propr[j]).paddingTop.replace('px','')*scale+'px';
                            propr[j].style.paddingLeft=window.getComputedStyle(propr[j]).paddingLeft.replace('px','')*scale+'px';
                            propr[j].style.paddingRight=window.getComputedStyle(propr[j]).paddingRight.replace('px','')*scale+'px';
                            propr[j].style.paddingBottom=window.getComputedStyle(propr[j]).paddingBottom.replace('px','')*scale+'px';
                            propr[j].style.marginTop=window.getComputedStyle(propr[j]).marginTop.replace('px','')*scale+'px';
                            propr[j].style.marginBottom=window.getComputedStyle(propr[j]).marginBottom.replace('px','')*scale+'px';
                            propr[j].style.marginLeft=window.getComputedStyle(propr[j]).marginLeft.replace('px','')*scale+'px';
                            propr[j].style.marginRight=window.getComputedStyle(propr[j]).marginRight.replace('px','')*scale+'px';
                        }
                    }
                }
            }
            $timeout(function(){
                resize();
            })
    }
})();