(function (app) {
    'use strict'

    app.factory('MonthPicker', ['$rootScope', '$ionicPopup', function ($rootScope, $ionicPopup) {
        var scope;

        return {
            /**
             * Call for initialization
             * @param options
             */
            init: function (options) {
                scope = $rootScope.$new();
                //
                // Options and defaults
                //
                scope.yearLabels = [];
                scope.currentYear = options.startingYear || new Date().getFullYear;
                for (var i = 0; i < 12; i++) {
                    scope.yearLabels.push(scope.currentYear);
                    scope.currentYear = scope.currentYear + 1;
                }
                scope.dateFormat = '按月选择';
                scope.monthOrYear = options.monthOrYear||'month';// month or year
                scope.minMonthIndex = options.minMonthIndex || 0;
                scope.minYear = options.minYear || new Date().getFullYear();
                scope.maxMonthIndex = options.maxMonthIndex === undefined ? new Date().getMonth() : options.maxMonthIndex;
                scope.maxYear = options.maxYear || new Date().getFullYear();
                scope.monthLabels = options.monthLabels || ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                scope.title = options.title || 'Select month';
                scope.cancelText = options.cancelText || 'Cancel';
                scope.cancelClass = options.cancelClass || 'button-assertive';
                //
                // What user selects
                //
                scope.selection = {
                    year: options.startingYear || scope.maxYear,
                    month: null // no month selected
                }

                scope.yearTitle = options.startingYear + '-' + scope.yearLabels[scope.yearLabels.length-1];

                    /**
                     * Arrow buttons
                     * @param index
                     */
                    scope.changeYear = function (index) {
                        var condition = scope.monthOrYear;
                        switch (condition) {
                            case 'month':
                                scope.selection.year += index;
                                break;
                            case 'year':
                                break;
                            default:
                                break;
                        }
                    }
                /**
                 * 切换时间选择模式，年或者月 
                 */
                scope.changeMonthOrYear = function () {
                    if (scope.monthOrYear == 'month') {
                        scope.monthOrYear = 'year';
                        scope.dateFormat = '按年选择';
                    } else {
                        scope.monthOrYear = 'month';
                        scope.dateFormat = '按月选择';
                    }
                }
                /**
                 * verify month index is in required interval
                 * @param index
                 * @returns {boolean}
                 */
                scope.isValidMonth = function (index) {
                    var invalid = (index < scope.minMonthIndex && scope.selection.year == scope.minYear) ||
                        (index > scope.maxMonthIndex && scope.selection.year == scope.maxYear) ||
                        scope.selection.year < scope.minYear ||
                        scope.selection.year > scope.maxYear
                    return !invalid
                }

                /**
                 * 查看选择的年份是不是正确的
                 * @param index 
                 */
                scope.isValidYear = function (index) {
                    var invalid = (index + 1 < scope.minYear && scope.selection.year == scope.minYear) ||
                        (index > scope.maxMonthIndex && scope.selection.year == scope.maxYear) ||
                        scope.selection.year < scope.minYear ||
                        scope.selection.year > scope.maxYear
                    return !invalid
                }

                /**
                 * 获取上12年
                 */
                scope.getPreviousYearLables = function(){
                    var year = scope.yearLabels[0];
                    scope.yearLabels = [];
                    //遍历计算往前推12年
                    for(var i = 0; i < 12; i++){
                        scope.yearLabels.unshift(year);
                        year = year - 1;
                    }
                    scope.yearTitle = scope.yearLabels[0]+'-'+ scope.yearLabels[scope.yearLabels.length-1];
                }
                /**
                 * 获取下12年 
                 */
                scope.getLaterYearLables = function(){
                    var year = scope.yearLabels[scope.yearLabels.length-1];
                    scope.yearLabels = [];
                    //遍历计算往前推12年
                    for(var i = 0; i < 12; i++){
                        scope.yearLabels.push(year);
                        year = year + 1;
                    }
                    scope.yearTitle = scope.yearLabels[0] + '-' + scope.yearLabels[scope.yearLabels.length-1];
                }
            },
            /**
             * Show the month picker
             * @param callback
             */
            show: function (callback) {

                /**
                 * 重新初始化时间控件的数据
                 * 初始化年
                 */
                scope.currentYear = new Date().getFullYear();
                scope.yearLabels = [];
                for (var i = 0; i < 12; i++) {
                    scope.yearLabels.push(scope.currentYear);
                    scope.currentYear = scope.currentYear + 1;
                }
                /**
                 * 初始化选择月
                 */
                scope.selection.year = new Date().getFullYear() || scope.maxYear;
                scope.selection.month = null;// no month selected

                /**
                 * Tap on month
                 * @param index
                 */
                scope.selectMonth = function (index) {
                    if (scope.isValidMonth(index)) {
                        scope.selection.month = index
                        popup.close()
                    }
                }
                /**
                 * Tap on Year
                 * @param index 
                 */
                scope.selectYear = function (index) {
                    scope.selection.year = scope.yearLabels[index];
                    popup.close(); 
                }
                //
                // Actual popup
                //
                var popup = $ionicPopup.show({
                    templateUrl: './lib/ionic-monthpicker/src/monthpicker.html',
                    title: scope.title,
                    scope: scope,
                    buttons: [{
                        text: scope.cancelText,
                        type: scope.cancelClass
                    }]
                })

                popup.then(function (res) {
                    // return clone obj not internal private obj
                    callback({
                        condition:scope.monthOrYear,
                        year: scope.selection.year,
                        month: scope.selection.month
                    })
                })
            }
        }
    }])
}(angular.module('ionic-monthpicker')))
