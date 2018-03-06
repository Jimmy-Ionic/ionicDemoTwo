(function() {
    'use strict';

    angular
        .module('app.tradeAndRegion')
        .config(tradeAndRegionConfig);

    tradeAndRegionConfig.$inject = ['$stateProvider'];

    /** @ngInject */
    function tradeAndRegionConfig($stateProvider) {
        $stateProvider
            .state('tradeAndRegion', {
                url: '/tradeAndRegion',
                params: {datas : null},
                cache: true,
                templateUrl: 'templates/ECA/tradeAndRegion/tradeAndRegion.html'
            });
    }
}());