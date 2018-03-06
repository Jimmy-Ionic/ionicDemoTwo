(function () {
    'use strict';

    angular
    .module('app.news')
    .service('newsService', newsService);

        newsService.$inject = ['$rootScope', '$http','SYS_INFO'];
        /** @ngInject */
        function newsService($rootScope, $http, SYS_INFO) {
      	    var service={
      	  	    getPageData:getPageData
      	    };
      	    return service;
      	    function getPageData(parm){
                return $http({
                    url: SYS_INFO.SERVER_PATH + '/RestService.svc/rest/getNewsList/' + parm,
                    method:'GET'
                })
                .then($rootScope.getDatasSuccess)
                .catch($rootScope.getDatasFailed);       	  	    
      	    }
        }
})();
