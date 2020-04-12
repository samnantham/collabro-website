'use strict';
app.controller('NotificationCtrl', ['$scope', '$modal', '$state', 'webServices', 'utility', '$rootScope', function($scope, $modal, $state, webServices, utility, $rootScope) {
    $scope.firstloadingcompleted = false;
    $scope.notifications = [];
    $scope.productData = {};
    $scope.pageno = 1;
    $scope.totalData = 0;
    $scope.totalPerPage = 8;

    $scope.getmyNotifications = function() {
        webServices.get('mynotifications/' + $scope.totalPerPage + '?page=' + $scope.pageno).then(function(getData) {
            $rootScope.formLoading = false;
            if (getData.status == 200) {
                $scope.totalData = getData.data.total;
                $scope.notifications = $scope.notifications.concat(getData.data.data);
                if (!$scope.firstloadingcompleted) {
                    $scope.firstloadingcompleted = true;
                }
            } else {
                $rootScope.logout();
            }
        });
    }

    $scope.loadMoreRecords = function() {
        if ($scope.getmyNotifications.length < $scope.totalData) {
            $rootScope.formLoading = true;
            $scope.pageno++;
            $scope.getmyNotifications();
        }
    }

    $scope.readmessage = function(notification, notificationtype, type, key, innerkey) {
        console.log(notification, notificationtype, type, key, innerkey)
        if (!notification.status) {
            webServices.put('readnotification/' + notification.id).then(function(getData) {
                $rootScope.formLoading = false;
                if (type == 'single') {
                    $scope.notifications[key].status = 1;
                }else if(type == 'accordion'){
                    $scope.notifications[key].messages[innerkey].status = 1;
                }
                if (getData.status == 200) {
                    $rootScope.getUserInfo();
                }
            });
        }

        if (notificationtype == 1) {
            $rootScope.ResponseData = {};
            $rootScope.ResponseData.notificationid = notification.id;
            if(type == 'single'){
                var url = 'commisionitem/' + notification.itemid;
            }else if(type == 'accordion'){
                if(innerkey > 0){
                    var url = 'commisionitem/' + notification.itemid+'/1';
                }else{
                    var url = 'commisionitem/' + notification.itemid;
                }
            }
            webServices.get(url).then(function(getData) {
                if (getData.status == 200) {
                    $rootScope.ResponseData = getData.data;
                    $rootScope.ResponseData.showdetails = 0;
                    $rootScope.ResponseData.isreject = 0;
                    $rootScope.ResponseData.commisionactive = 0;
                    $rootScope.ResponseData.iscounter = 0;
                    $rootScope.ResponseData.isaccept = 0;
                    $rootScope.ResponseData.isacceptoffer = 0;
                    if ($rootScope.ResponseData.startdate) {
                        $rootScope.ResponseData.productstartdate = new Date($rootScope.ResponseData.startdate);
                    }
                    if ($rootScope.ResponseData.enddate) {
                        $rootScope.ResponseData.productenddate = new Date($rootScope.ResponseData.enddate);
                    }
                    $rootScope.ResponseData.showdetails = true;
                    $rootScope.popupcarouselItems = $rootScope.ResponseData.commisionitem.productdetails.images;
                    console.log($rootScope.ResponseData)
                    $rootScope.openModalPopup('responseModal');
                } else {
                    $rootScope.logout();
                }
            });
        } else if (notificationtype == 2) {
            webServices.get('project/' + notification.itemid).then(function(getData) {
                console.log(getData)
                if (getData.status == 200) {
                    $rootScope.notificationprojectData = getData.data;
                    $rootScope.collabthumb = 0;
                    $rootScope.popupcarouselItems = $rootScope.notificationprojectData.files;
                    console.log($rootScope.popupcarouselItems)
                    $rootScope.openModalPopup('collaborateresponseModal');
                } else {
                    $rootScope.logout();
                }
            });
        }
    }
    
    $rootScope.gotocollabchat = function() {
        $rootScope.closepopoverItem();
        $state.go('app.projectdetails', {
            'id': $rootScope.notificationprojectData.member.project
        });
    }

    $scope.deletenotification = function(key, notification, type, innerkey) {
        $rootScope.itemkey = key;
        $rootScope.iteminnerkey = innerkey;
        $rootScope.confirmData = {};
        $rootScope.confirmpopupData = {};
        $rootScope.confirmData.title = 'Remove notification item?';
        $rootScope.confirmData.message = 'You are about to remove this notification item. Are you sure you want to remove it?';
        $rootScope.confirmpopupData.id = notification.id;
        $rootScope.confirmpopupData.status = notification.status;
        $rootScope.confirmpopupData.type = type;
        $rootScope.openConfirm();
    }

    $rootScope.removeNotification = function(){
        webServices.delete('deletenotification/' + $rootScope.confirmpopupData.id).then(function(getData) {
                            if (getData.status == 200) {
                                if($rootScope.confirmpopupData.type == 'single'){
                                    $scope.notifications.splice($rootScope.itemkey , 1); 
                                }else if($rootScope.confirmpopupData.type == 'accordion'){
                                    $scope.notifications[$rootScope.itemkey].messages.splice($rootScope.iteminnerkey, 1);
                                }
                                if (!$rootScope.confirmpopupData.status) {
                                    $rootScope.user.notifications--;
                                }
                                $rootScope.closeModal();
                            }
                        });
    }

    $scope.getmyNotifications();
}]);