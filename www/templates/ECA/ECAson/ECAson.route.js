(function () {
    'use strict';

    angular
        .module('app.ECAson')
        .config(ECAsonConfig);

    ECAsonConfig.$inject = ['$stateProvider'];

    /** @ngInject */
    function ECAsonConfig($stateProvider) {
        $stateProvider
            .state('ECAson', {
                url: '/ECAson',
                params: { ecaSonData: null },
                templateUrl: 'templates/ECA/ECAson/ECAson.html'
            });
    }
}());