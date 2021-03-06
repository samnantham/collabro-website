'use strict';
app.controller('FriendsCtrl', ['$scope', '$http', '$state', 'authServices', '$timeout', 'webServices', 'utility', '$rootScope', 'animatedScroll', function($scope, $http, $state, authServices, $timeout, webServices, utility, $rootScope, animatedScroll) {
    $scope.IMGURL = app.imageurl;
    $scope.firstloadingcompleted = false;
    $rootScope.fromfriendspage = false;
    $scope.isfriendchanged = false;
    $scope.ispeoplechanged = false;
    $scope.ispagechanged = false;
    $scope.friendspagedata = [];
    $scope.friendsandfollowers = [];
    $scope.otherpeoplespagedata = [];
    $scope.friends = [];
    $scope.otherpeoples = [];
    $scope.friendspageno = 1;
    $scope.peoplespageno = 1;
    $scope.totalData = 0;
    $scope.totalPerPage = 6;
    $scope.dummyarray = [1,2,3,4];
    $scope.url = 'myfriends/';
    $scope.secondurl = 'otherpeoples/';

    $scope.getfriends = function() {
        webServices.get($scope.url + $scope.totalPerPage + '?page=' + $scope.friendspageno).then(function(getData) {
            if (getData.status == 200) {
                $scope.friendspagination = {
                    current: $scope.friendspageno
                };
                $scope.friendspagedata[$scope.friendspageno] = getData.data;
                $scope.friends = getData.data;
                if (!$scope.firstloadingcompleted || $scope.isfriendchanged) {
                    $scope.isfriendchanged = false;
                    $scope.getotherpeoples();
                } else {
                    if($scope.ispagechanged){
                    }
                    $rootScope.formLoading = false;
                }
            } else {
                $rootScope.logout();
            }
        });

        $scope.sortfriends = function(key, order) {
            $scope.url = 'sortmyfriends/' + key + '/' + order + '/';
            $scope.getfriends();
        }

        $scope.sortotherpeoples = function(key, order) {
            $scope.secondurl = 'sortotherpeoples/' + key + '/' + order + '/';
            $scope.getotherpeoples();
        }

        $scope.getfriendsfollowers = function() {
            webServices.get('myrecentfriendsandfollowers').then(function(getData) {
                if (getData.status == 200) {
                    $scope.friendsandfollowers = getData.data;
                    $scope.firstloadingcompleted = true;
                    $rootScope.formLoading = false;
                } else {
                    $rootScope.logout();
                }
            });
        };
    };

    $scope.gotoprivatechat = function(userid) {
        webServices.put('privatechat/' + userid).then(function(getData) {
            if (getData.status == 200) {
                $state.go('app.userchat', {
                    'chatid': getData.data.id
                });
            }
        });
    }

    $scope.getotherpeoples = function() {
        webServices.get($scope.secondurl + $scope.totalPerPage + '?page=' + $scope.peoplespageno).then(function(getData) {
            if (getData.status == 200) {
                $scope.peoplespagination = {
                    current: $scope.peoplespageno
                };
                $scope.otherpeoplespagedata[$scope.peoplespageno] = getData.data;
                $scope.otherpeoples = getData.data;
                if (!$scope.firstloadingcompleted) {
                    $scope.getfriendsfollowers();
                } else {
                    $rootScope.formLoading = false;
                    if($scope.ispeoplechanged){
                        $scope.getfriends();
                    }
                    if($scope.ispagechanged){
                    }
                    if (!$scope.firstloadingcompleted) {
                        $rootScope.formLoading = false;
                    }
                }
            } else {
                $rootScope.logout();
            }
        });
    };

    $scope.changefriendfollowstatus = function(key, user) {
        $scope.ispagechanged = false;
        $scope.isfriendchanged = true;
        webServices.put('followuser/' + user.id + '/0').then(function(getData) {
            if (getData.status == 200) {
                if($scope.friends.data.length == 1){
                    $scope.friendspageno --;
                }
                $rootScope.$emit("showsuccessmsg", getData.data.message);
                $scope.getfriends();
            }else if(getData.status == 401){
                if($scope.friends.data.length == 1){
                    $scope.friendspageno --;
                }
                $rootScope.$emit("showerrormsg", getData.data.message);
                $scope.getfriends();
            }
        });
    }

    $scope.collaborate = function(user) {
        $rootScope.fromfriendspage = true;
        $rootScope.formData = {};
        $rootScope.formData.projectmembers = [];
        $rootScope.formData.projectmembers.push(user);
        $rootScope.openCollaborateModal();
    }

    $scope.changefollowstatus = function(key, user) {
        $scope.ispagechanged = false;
        if ($scope.otherpeoples.data[key].isfollow) {
            var status = 0;
        } else {
            var status = 1;
        }
        webServices.put('followuser/' + user.id + '/' + status).then(function(getData) {
            if (getData.status == 200) {
                $rootScope.$emit("showsuccessmsg", getData.data.message);
                if (status) {
                    $scope.otherpeoples.data[key].isfollow = 1;
                } else {
                    $scope.otherpeoples.data[key].isfollow = 0;
                }
                $scope.getotherpeoples();
                if(getData.data.isfollow > 0){
                    $scope.getfriends();
                }
            }else if(getData.status == 401){
                if($scope.friends.data.length == 1){
                    $scope.friendspageno --;
                }
                $rootScope.$emit("showerrormsg", getData.data.message);
                $scope.getotherpeoples();
                if(getData.data.isfollow > 0){
                    $scope.getfriends();
                }
            }
        });
    }


    $scope.pageChanged = function(newPage,type) {
        $scope.ispagechanged = true;
        if(type == 'friends'){
            $scope.friendspageno = newPage;
            if (!$scope.friendspagedata[$scope.friendspageno]) {
                $scope.getfriends();
            } else {
                $scope.friends = $scope.friendspagedata[$scope.friendspageno];
            }
            $timeout(function() {
                $rootScope.scrollToID('Friends');
            }, 500);
        }else if(type == 'otherpeoples'){
            $scope.peoplespageno = newPage;
            if (!$scope.otherpeoplespagedata[$scope.peoplespageno]) {
                $scope.getotherpeoples();
            } else {
                $scope.otherpeoples = $scope.otherpeoplespagedata[$scope.peoplespageno];
            }
            $timeout(function() {
                $rootScope.scrollToID('Others');
            }, 500);
        }  
    };

    $rootScope.sharefriendtosocial = function(data) {
        $rootScope.shareData = {};
        $rootScope.shareData = data;
        $rootScope.shareData.shareurl = app.friendshareurl;
        $rootScope.sharetype = 'friend';
        $rootScope.opensharepopover();
    }

    $scope.getfriends();

}]);