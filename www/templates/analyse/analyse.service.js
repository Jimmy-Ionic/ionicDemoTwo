; (function () {
  'use strict'

  angular
    .module('app.analyse')
    .service('analyseService', analyseService)

  analyseService.$inject = ['$http']
  /** @ngInject */
  function analyseService($http) {
    var service = {
      getList: getList
    }
    return service
    /**
     * 获取子页面的各种信息
     */
    function getList() {
      var listData = [{
        id: 0,
        name: '耗能公示',
        lastText: '耗能公示',
        face: 'img/hngs.png',
        url: '#/home/energyRank/'
      }, {
        id: 1,
        name: '能耗监测分析',
        lastText: '能耗监测分析',
        face: 'img/nyxffx.png',
        url: '#/energyMonitor//'
      }, {
        id: 2,
        name: '产值单耗分析',
        lastText: '产值单耗分析',
        face: 'img/czdhfx.png',
        url: '#/consumption'
      },
      {
        id: 3,
        name: '节能量完成情况预警',
        lastText: '节能量完成情况预警',
        face: 'img/jnlwcqkyj.png',
        url: '#/energysaving'
      },
      {
        id: 4,
        name: '能源消费分析',
        lastText: '能源消费分析',
        face: 'img/nyxffx.png',
        url: '#/ECA/////'
      }]
      return listData;
    }

  }
})()
