'use strict';
app.controller('UserChatsCtrl', ['$scope', '$http', '$state', '$timeout', 'webServices', 'utility', '$rootScope', 'Facebook', 'GoogleSignin', function($scope, $http, $state, $timeout, webServices, utility, $rootScope, Facebook, GoogleSignin) {

    $scope.pageno = 1;
    $scope.totalData = 0;
    $scope.totalPerPage = 10;
    $scope.chatusers = {};
    $scope.chatuserspagedata = [];
    $scope.url = 'mychatusers/';
    $scope.changepage = false;

    $scope.getmyChatUsers = function() {
        webServices.get($scope.url + $scope.totalPerPage + '?page=' + $scope.pageno).then(function(getData) {
            $rootScope.formLoading = false;
            if (getData.status == 200) {
                $scope.pagination = {
                    current: $scope.pageno
                };
                $scope.chatusers = getData.data;
                $scope.chatuserspagedata[$scope.pageno] = getData.data;
                if($scope.changepage){
                    $scope.movetoTop(100);
                }
            } else {
                $rootScope.logout();
            }
        });
    }

    $scope.filterchats = function(type) {
        $scope.chatusers = [];
        $scope.pageno = 1;
        $rootScope.formLoading = true;
        $scope.url = 'filterchatusers/' + type + '/';
        $scope.getmyChatUsers();
    }

    $scope.removechat = function(key, chat) {
        $rootScope.itemkey = key;
        $rootScope.confirmData = {};
        $rootScope.confirmpopupData = {};
        $rootScope.confirmData.title = 'Remove chat item?';
        $rootScope.confirmData.message = 'You are about to remove this chat item. Are you sure you want to remove it?';
        $rootScope.confirmpopupData.id = chat.id;
        $rootScope.confirmpopupData.status = chat.status;
        $rootScope.openConfirm();
    }

    $scope.pageChanged = function(newPage) {
        $scope.changepage = true;
        $scope.pageno = newPage;
        if (!$scope.chatuserspagedata[$scope.pageno]) {
            $scope.getmyChatUsers();
        } else {
            $scope.chatusers = $scope.chatuserspagedata[$scope.pageno];
            $scope.movetoTop(100);
        }
    };

    $rootScope.deleteChat = function(){
        webServices.delete('deleteuserchat/' + $rootScope.confirmpopupData.id).then(function(getData) {
            if (getData.status == 200) {
                if (!$rootScope.confirmpopupData.status) {
                    $rootScope.user.chatmessages--;
                }
                $scope.chatusers.splice($rootScope.itemkey, 1);
                $rootScope.closeModal();
            }
        });
    }

    $scope.gotochatpage = function(key, data) {
        console.log(data)
        if (!data.status) {
            webServices.put('readuserchat/' + data.id).then(function(getData) {
                $scope.chatusers.data[key].status = 1;
                if ($rootScope.user.chatmessages > 0) {
                    $rootScope.user.chatmessages--;
                }
                if (data.chattype == 1) {
                    $state.go('app.productchat', {
                        'id': data.productchatid
                    });
                } else if (data.chattype == 2) {
                    $state.go('app.projectdetails', {
                        'id': data.productid
                    });
                } else if (data.chattype == 3) {
                    $state.go('app.feedchat', {
                        'chatid': data.productid
                    });
                } else if (data.chattype == 4) {
                    $state.go('app.userchat', {
                        'chatid': data.productid
                    });
                }
            });
        } else {
            if (data.chattype == 1) {
                $state.go('app.productchat', {
                    'id': data.productchatid
                });
            } else if (data.chattype == 2) {
                $state.go('app.projectdetails', {
                    'id': data.productid
                });
            } else if (data.chattype == 3) {
                $state.go('app.feedchat', {
                    'chatid': data.productid
                });
            } else if (data.chattype == 4) {
                $state.go('app.userchat', {
                    'chatid': data.productid
                });
            }
        }
    }

    $scope.movetoTop = function(pos) {
        $timeout(function() {
            $scope.changepage = false;
            $rootScope.scrollToPoint(pos);
        }, 200);
    }


    $scope.getfriendsfollowers = function() {
        webServices.get('myrecentfriendsandfollowers').then(function(getData) {
            if (getData.status == 200) {
                $scope.friendsandfollowers = getData.data;
                $scope.getmyChatUsers();
            } else {
                $rootScope.logout();
            }
        });
    };


    $scope.getfriendsfollowers();
}]);