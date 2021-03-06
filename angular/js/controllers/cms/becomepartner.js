'use strict';
app.controller('CMS4Ctrl', ['$scope', '$sce', '$state', '$timeout', 'webServices', 'utility', '$rootScope', '$stateParams', function($scope, $sce, $state, $timeout, webServices, utility, $rootScope, $stateParams) {
    $scope.pageData = {};

    $scope.getContent = function() {
        webServices.get('getpageData/4').then(function(getData) {
            $rootScope.formLoading = false;
            if (getData.status == 200) {
                $scope.pageData = getData.data;
                $scope.pageData.content = $sce.trustAsHtml($scope.pageData.content);
            }
        });
    };

    $scope.getContent();
}]);