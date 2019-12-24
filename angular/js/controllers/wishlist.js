'use strict';
app.controller('WishlistCtrl', ['$scope', '$http', '$state', '$timeout', 'webServices', 'utility', '$rootScope', '$stateParams', 'anchorSmoothScroll', '$ngConfirm', function($scope, $http, $state, $timeout, webServices, utility, $rootScope, $stateParams, anchorSmoothScroll, $ngConfirm) {

    $scope.firstloadingcompleted = false;
    $scope.pagedata = [];
    $scope.wishedproducts = [];
    $scope.comparedproducts = [];
    $scope.iscompared = false;
    $scope.pageno = 1;
    $scope.totalPerPage = 12;
    $scope.url = 'mywishlist/';

    $scope.getWishedproducts = function() {
        webServices.get($scope.url + $scope.totalPerPage+ '?page=' +$scope.pageno).then(function(getData) {
            if (getData.status == 200) {
                $scope.pagination = {
                    current: $scope.pageno
                };
                $scope.pagedata[$scope.pageno] = getData.data;
                $scope.wishedproducts = getData.data;
                if(!$scope.iscompared){
                    $scope.getComparedproducts();
                }else{
                    $rootScope.formLoading = false;
                    //anchorSmoothScroll.scrollTo('wishlist');
                }
            } else{
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
                //anchorSmoothScroll.scrollTo('wishlist');
            } else{
                $rootScope.logout();
            }

        });
    };

    $scope.pageChanged = function(newPage) {
        $scope.pageno = newPage;
        if(!$scope.pagedata[$scope.pageno]) {
            $scope.getWishedproducts();
        } else {
            $scope.wishedproducts = $scope.pagedata[$scope.pageno];
            $rootScope.formLoading = false;
            //anchorSmoothScroll.scrollTo('wishlist');
        }
    };

    $scope.sortwishlist = function(key,order){
        $scope.url = 'sortmywishlist/'+key+'/'+order+'/';
        $scope.getWishedproducts();
    }

    $scope.filtercompared =  function() {
       if($scope.comparefilter){
            webServices.get('filtercompared/'+$scope.comparefilter).then(function(getData) {
                if (getData.status == 200) {
                    $scope.comparedproducts = getData.data;
                    $rootScope.formLoading = false;
                } else{
                    $rootScope.logout();
                }
            });
       }else{
            $scope.getComparedproducts();
       }
    };

    $scope.changeiscompared = function(key,item){
        console.log(item)
        if(item.iscompared == 1){
            $scope.wishedproducts.data[key].iscompared = 0;
            $scope.removewishcompare(key,item);
        }else{
            $scope.wishedproducts.data[key].iscompared = 1;
            $scope.addtocompare(item);
        }
    }

    $scope.addtocompare = function(product){
        var obj = {};
        obj.productid = product.productid;
        obj.wishstatus = 1;
        obj.iscompared = 1;
        $scope.updatewish('compare',obj);
    }

    $scope.removefromwish = function(product){
        var obj = {};
        obj.productid = product.productid;
        obj.wishstatus = 0;
        obj.iscompared = 0;
        var message = 'Remove wishlist item';
        $ngConfirm({
            title: message,
            content: 'You are about to remove this wishlist item. Are you sure you want to remove it ?',
            type: 'red',
            typeAnimated: true,
            closeIcon: true,
            closeIconClass: 'fa fa-close',
            buttons: {
                tryAgain: {
                    text: 'Yes',
                    btnClass: 'danger-btn',
                    action: function() {
                        $scope.updatewish('remove',obj);
                    }
                },
                cancel: {
                    text: 'No',
                    btnClass: 'success-btn',
                    action: function () {
                    }
                }                                
            }
        });
    }

    $scope.removewishcompare = function(key,item){
        var obj = {};
        obj.productid = item.productid;
        obj.wishstatus = 1;
        obj.iscompared = 0;
        $ngConfirm({
            title: 'Are you sure?'/*'Are you sure, want to remove this item from compare list'*/,
            content: '',
            type: 'red',
            typeAnimated: true,
            closeIcon: true,
            closeIconClass: 'fa fa-close',
            buttons: {
                tryAgain: {
                    text: 'Yes',
                    btnClass: 'success-btn',
                    action: function() {
                        $scope.wishedproducts.data[key].iscompared = 0;
                        $scope.updatewish('compare',obj);
                    }
                },     
                cancel: {
                    text: 'No',
                    btnClass: 'danger-btn',
                    action: function () {
                    }
                }                           
            }
        });
    }

    $scope.removecompared = function(product){
        var obj = {};
        obj.productid = product.productid;
        obj.wishstatus = 1;
        obj.iscompared = 0;
        $ngConfirm({
            title: 'Are you sure?',/*'Are you sure, want to remove this item from compare list',*/
            content: '',
            type: 'red',
            typeAnimated: true,
            buttons: {
                cancel: {
                    text: 'No',
                    btnClass: 'danger-btn',
                    action: function () {
                    }
                },
                tryAgain: {
                    text: 'Yes',
                    btnClass: 'success-btn',
                    action: function() {
                        $scope.updatewish('remove',obj);
                    }
                }                                             
            }
        });
    }

    $scope.updatewish = function(type,data){
        webServices.put('updatewish' , data).then(function(getData) {
            if (getData.status == 200) {
                    $scope.iscompared = false;
                if (type == 'compare') {
                    $scope.getWishedproducts();
                } else {
                    $scope.getWishedproducts();
                }
            }
        });
    }

    $scope.getWishedproducts();

}]);