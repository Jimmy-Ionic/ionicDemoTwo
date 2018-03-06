(function () {
    'use strict';
    angular.module('app.search').service('searchService', searchService);
    searchService.$inject = ['$rootScope', '$http', 'SYS_INFO'];
    /** @ngInject */
    function searchService($rootScope, $http, SYS_INFO) {
        var service = {
            getIndexList: getIndexList
        };
        return service;

        function getIndexList() {
            return $http({
                url: SYS_INFO.SERVER_PATH + '/RestService.svc/rest/getIndex'
            }).then($rootScope.getDatasSuccess).catch($rootScope.getDatasFailed);
        }
    }
    ////////////////
})();