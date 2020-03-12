'use strict';
app.controller('FeedCtrl', ['$scope', '$timeout', '$http', '$state', 'webServices', 'utility', '$rootScope', '$modal', function($scope, $timeout, $http, $state, webServices, utility, $rootScope, $modal) {
    $scope.wishedfeeddata = [];
    $scope.myfeeddata = [];
    $scope.wishedfeeds = [];
    $scope.myfeeds = [];
    $scope.pageno = 1;
    $scope.totalPerPage = 10;
    $scope.activetab = 'myfeed';
    $scope.changepage = false;

    $scope.getmyfeeds = function() {
        webServices.get('myfeeds/' + $scope.totalPerPage + '?page=' + $scope.pageno).then(function(getData) {
            $rootScope.formLoading = false;
            if (getData.status == 200) {
                $scope.myfeeds = getData.data;
                $scope.myfeeddata[$scope.pageno] = getData.data;
                $scope.myfeedpagination = {
                    current: $scope.pageno
                };
                if($scope.changepage){
                    $scope.movetoTop(100);
                }
            } else {
                $rootScope.logout();
            }
        });
    }

    $scope.setactivetab = function(tab) {
        $scope.changepage = false;
        if (tab != $scope.activetab) {
            $scope.pageno = 1;
            $scope.activetab = tab;
            $rootScope.formLoading = true;
            if (tab == 'myfeed') {
                $scope.getmyfeeds();
            } else if (tab == 'wishedfeed') {
                $scope.getwishedfeeds();
            }
        }
    }

    $scope.updatefeedwish = function(feed, key) {
        webServices.put('feedstatus/' + feed.id + '/' + 0).then(function(getData) {
            if (getData.status == 200) {
                $rootScope.$emit("showerrormsg", getData.data.message);
                $scope.getwishedfeeds();
            }
        });
    }

    $scope.gotofeedchat = function(feedid) {
        webServices.put('feedchat/' + feedid + '/' + $rootScope.user.id).then(function(getData) {
            if (getData.status == 200) {
                $state.go('app.feedchat', {
                    'chatid': getData.data.id
                });
            }
        });
    }

    $scope.removefeed = function(key, feedid) {
        $rootScope.confirmData = {};
        $rootScope.confirmpopupData = {};
        $rootScope.confirmData.title = 'Remove feed item?';
        $rootScope.confirmData.message = 'You are about to remove this chat item. Are you sure you want to remove it?';
        $rootScope.confirmpopupData.id = feedid;
        $rootScope.openConfirm();
    }

    $rootScope.deleteFeed = function() {
        webServices.delete('feed/' + $rootScope.confirmpopupData.id).then(function(getData) {
            if (getData.status == 200) {
                $rootScope.$emit("showerrormsg", getData.data.message);
                $rootScope.closeModal();
                $scope.getmyfeeds();
            }
        });
    }

    $scope.getwishedfeeds = function() {
        webServices.get('wishedfeeds/' + $scope.totalPerPage + '?page=' + $scope.pageno).then(function(getData) {
            $rootScope.formLoading = false;
            if (getData.status == 200) {
                $scope.wishedfeeds = getData.data;
                $scope.wishedfeeddata[$scope.pageno] = getData.data;
                $scope.wishedfeedpagination = {
                    current: $scope.pageno
                };
                if($scope.changepage){
                    $scope.movetoTop(100);
                }
            } else {
                $rootScope.logout();
            }
        });
    }

    $scope.pageChanged = function(newPage) {
        $scope.pageno = newPage;
        $scope.changepage = true;
        if ($scope.activetab == 'myfeed') {
            if (!$scope.myfeeddata[$scope.pageno]) {
                $scope.getmyfeeds();
            } else {
                $scope.myfeeds = $scope.myfeeddata[$scope.pageno];
                $scope.movetoTop(100);
            }
        } else if ($scope.activetab == 'wishedfeed') {
            if (!$scope.wishedfeeddata[$scope.pageno]) {
                $scope.getwishedfeeds();
            } else {
                $scope.wishedfeeds = $scope.wishedfeeddata[$scope.pageno];
                $scope.movetoTop(100);
            }
        }
    };


    $scope.movetoTop = function(pos) {
        $timeout(function() {
            $rootScope.scrollToPoint(pos);
        }, 200);
    }


    $scope.getmyfeeds(0);
}]);