'use strict';
app.controller('ViewFeedCtrl', ['$scope', '$http', '$state', '$stateParams', 'webServices', 'utility', '$rootScope', '$timeout', '$filter', '$firebaseArray', function($scope, $http, $state, $stateParams, webServices, utility, $rootScope, $timeout, $filter, $firebaseArray) {
    $rootScope.formLoading = true;
    $rootScope.feedData = {};

    $scope.getFeed = function() {
        webServices.get('feed/' + $stateParams.id).then(function(getData) {
            if (getData.status == 200) {
                $rootScope.feedData = getData.data;
                $rootScope.carouselItems = $rootScope.feedData.files;
                if($rootScope.feedData.owner.id != $rootScope.user.id){
                    $scope.gotofeedchat();
                }
                localStorage.redirectData = '';
                $timeout(function() {
                    $rootScope.$emit("reloadSlider", {});
                }, 1000);
            } else {
                $rootScope.logout();
            }
        });
    };

     $scope.gotofeedchat = function() {
        webServices.put('feedchat/' + $stateParams.id + '/' + $rootScope.user.id).then(function(getData) {
            if (getData.status == 200) {
                $state.go('app.feedchat', {
                    'chatid': getData.data.id
                });
            }
        });
    }

    $rootScope.editFeed = function(data) {
        $rootScope.iseditfeed = true;
        $rootScope.editfeedid = data.id;
        $rootScope.openbroadcastModal();
    }

    $rootScope.editTodo = function(data) {
        $rootScope.isedittodo = true;
        $rootScope.edittodoid = data.id;
        $rootScope.opentodoModal();
    }

    $scope.getFeed();


}]);