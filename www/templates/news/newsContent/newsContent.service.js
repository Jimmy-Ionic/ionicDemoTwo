(function () {
    'use strict';

    angular
        .module('app.newsContent')
        .service('newsContentService', newsContentService);

    newsContentService.$inject = ['$rootScope', '$http', 'SYS_INFO'];
    /** @ngInject */
    function newsContentService($rootScope, $http, SYS_INFO) {
        var service = {
            getPageData: getPageData
        };
        return service;
        function getPageData(id) {
            var data = {
                "ID": id
            };
            console.log(data);
            return $http({
                url: SYS_INFO.SERVER_PATH + '/RestService.svc/rest/getNewsText',
                method: 'POST',
                data: data
            })
                .then($rootScope.getDatasSuccess)
                .catch($rootScope.getDatasFailed);
        }
    }
})();
