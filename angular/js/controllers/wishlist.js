'use strict';
app.controller('WishlistCtrl', ['$scope', '$http', '$state', '$timeout', 'webServices', 'utility', '$rootScope', '$stateParams', 'anchorSmoothScroll', '$modal', function($scope, $http, $state, $timeout, webServices, utility, $rootScope, $stateParams, anchorSmoothScroll, $modal, $modalInstance) {

    $scope.firstloadingcompleted = false;
    $scope.pagedata = [];
    $scope.wishedproducts = [];
    $scope.comparedproducts = [];
    $scope.iscompared = false;
    $scope.pageno = 1;
    $scope.totalPerPage = 12;
    $scope.url = 'mywishlist/';
    $scope.changepage = false;
    $scope.iscompared = false;

    $scope.getWishedproducts = function() {
        webServices.get($scope.url + $scope.totalPerPage + '?page=' + $scope.pageno).then(function(getData) {
            if (getData.status == 200) {
                $scope.pagination = {
                    current: $scope.pageno
                };
                $scope.pagedata[$scope.pageno] = getData.data;
                $scope.wishedproducts = getData.data;
                if (!$scope.iscompared) {
                    $scope.getComparedproducts();
                }if($scope.changepage){
                    $scope.movetoTop(100);
                }
            } else {
                $rootScope.logout();
            }
        });
    };

    $scope.getComparedproducts = function() {
        $scope.iscompared = true;
        webServices.get('compared').then(function(getData) {
            if (getData.status == 200) {
                $rootScope.formLoading = false;
                $scope.comparedproducts = getData.data;
            } else {
                $rootScope.logout();
            }

        });
    };

    $scope.pageChanged = function(newPage) {
        $scope.isunwished = false;
        $scope.pageno = newPage;
        if (!$scope.pagedata[$scope.pageno]) {
            $scope.getWishedproducts();
        } else {
            $scope.wishedproducts = $scope.pagedata[$scope.pageno];
            $rootScope.formLoading = false;
        }
        $scope.movetoTop(100);
    };

    $scope.sortwishlist = function(key, order) {
        $scope.pageno = 1;
        $scope.url = 'sortmywishlist/' + key + '/' + order + '/';
        $scope.getWishedproducts();
    }

    $scope.filtercompared = function() {
        if ($scope.comparefilter) {
            webServices.get('filtercompared/' + $scope.comparefilter).then(function(getData) {
                if (getData.status == 200) {
                    $scope.comparedproducts = getData.data;
                    $rootScope.formLoading = false;
                } else {
                    $rootScope.logout();
                }
            });
        } else {
            $scope.getComparedproducts();
        }
    };

    $scope.changeiscompared = function(key, item) {
        if (item.iscompared) {
            $scope.removewishcompare(key, item);
        } else {
            $scope.addtocompare(item);
        }
    }

    $scope.addtocompare = function(product) {
        $rootScope.confirmpopupData = {};
        $rootScope.confirmpopupData.productid = product.productid;
        $rootScope.confirmpopupData.wishstatus = 1;
        $rootScope.confirmpopupData.iscompared = 1;
        var msg = 'You have added an item to compare';
        $scope.updatewish('compare', msg, 1);
    }

    $scope.removefromwish = function(product) {
        $rootScope.confirmData = {};
        $rootScope.confirmData.removewish = true;
        $rootScope.confirmpopupData = {};
        $rootScope.confirmpopupData.productid = product.productid;
        $rootScope.confirmpopupData.wishstatus = 0;
        $rootScope.confirmpopupData.iscompared = 0;
        $rootScope.confirmData.title = 'Remove wishlist item?';
        $rootScope.confirmData.message = 'You are about to remove this wishlist item. Are you sure you want to remove it?';
        $rootScope.openConfirm();
    }

    $scope.removewishcompare = function(key, item) {
        $rootScope.itemkey = key;
        $rootScope.confirmData = {};
        $rootScope.confirmData.removewishcompare = true;
        $rootScope.confirmpopupData = {};
        $rootScope.confirmpopupData.productid = item.productid;
        $rootScope.confirmpopupData.wishstatus = 1;
        $rootScope.confirmpopupData.iscompared = 0;
        $rootScope.confirmData.title = 'Remove compared item?';
        $rootScope.confirmData.message = 'You are about to remove this compared item. Are you sure you want to remove it?';
        $rootScope.openConfirm();
    }

    $scope.removecompared = function(product) {
        $rootScope.confirmData = {};
        $rootScope.confirmData.removecompare = true;
        $rootScope.confirmpopupData = {};
        $rootScope.confirmData.title = 'Remove compared item?';
        $rootScope.confirmData.message = 'You are about to remove this compared item. Are you sure you want to remove it?';
        $rootScope.confirmpopupData.productid = product.productid;
        $rootScope.confirmpopupData.wishstatus = 1;
        $rootScope.confirmpopupData.iscompared = 0;
        $rootScope.openConfirm();
    }

    $rootScope.removeItem = function(){
        if($rootScope.confirmData.removecompare){
            var msg = 'You have removed a compared item';
            $scope.updatewish('remove', msg, 0);
        }if($rootScope.confirmData.removewishcompare){
            var msg = 'You have removed a compared item';
            $scope.wishedproducts.data[$rootScope.itemkey].iscompared = 0;
            $scope.updatewish('remove', msg, 0);
        }if($rootScope.confirmData.removewish){
            var msg = 'You have removed a wished item';
            $scope.updatewish('remove', msg, 0);
        }
    }

    $scope.updatewish = function(type, msg, status) {
        webServices.put('updatewish', $rootScope.confirmpopupData).then(function(getData) {
            if (getData.status == 200) {
                $scope.iscompared = false;
                $timeout(function() {
                    if(status){
                        $rootScope.$emit("showsuccessmsg", msg);
                    }else{
                        $rootScope.$emit("showerrormsg", msg);
                    }
                    $rootScope.closeModal();
                    if (type == 'compare') {
                        $scope.getWishedproducts();
                    } else {
                        $scope.getWishedproducts();
                    }
                }, 200);
            }
        });
    }

    $scope.movetoTop = function(pos) {
        $timeout(function() {
            $rootScope.scrollToPoint(pos);
        }, 200);
    }


    $scope.getWishedproducts();

}]);