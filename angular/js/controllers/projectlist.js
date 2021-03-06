'use strict';
app.controller('ProjectListCtrl', ['$scope', '$http', '$state', '$timeout', 'webServices', 'utility', '$rootScope', '$stateParams', function($scope, $http, $state, $timeout, webServices, utility, $rootScope, $stateParams) {
    
    $scope.projects = [];
    $scope.projectspagedata = [];
    $scope.pageno = 1;
    $scope.totalPerPage = 10;
    $scope.url = 'myprojects/' + $scope.totalPerPage;
    $scope.changepage = false;

    $scope.getmyprojects = function() {
        webServices.get($scope.url + '?page=' + $scope.pageno).then(function(getData) {
            $rootScope.formLoading = false;
            if (getData.status == 200) {
                $scope.pagination = {
                    current: $scope.pageno
                };
                $scope.projectspagedata[$scope.pageno] = getData.data;
                $scope.projects = getData.data;
                if($scope.changepage){
                    $scope.movetoTop(100);
                }

            } else {
                $rootScope.logout();
            }
        });
    };

    $scope.sortproject = function(key, order) {
        $rootScope.formLoading = true;
        $scope.pageno = 1;
        $scope.projects = [];
        $scope.projectspagedata = [];
        $scope.url = 'sortprojects/' + key + '/' + order + '/' + $scope.totalPerPage;
        $scope.getmyprojects();
    }

    $scope.pageChanged = function(newPage) {
        $scope.changepage = true;
        $scope.pageno = newPage;
        if (!$scope.projectspagedata[$scope.pageno]) {
            $scope.getmyprojects();
        } else {
            $scope.projects = $scope.projectspagedata[$scope.pageno];
            $scope.movetoTop(100);
        }
    };

    $scope.movetoTop = function(pos) {
        $timeout(function() {
            $scope.changepage = false;
            $rootScope.scrollToPoint(pos);
        }, 200);
    }

    $scope.getmyprojects();

}]);