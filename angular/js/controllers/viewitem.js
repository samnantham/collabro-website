'use strict';
app.controller('ViewItemCtrl', ['$scope', '$sce', '$http', '$state', '$stateParams', 'webServices', 'utility', '$rootScope', '$timeout', '$filter', function($scope, $sce, $http, $state, $stateParams, webServices, utility, $rootScope, $timeout, $filter) {
    $rootScope.viewData = {};
    $rootScope.chatMessage = {};
    $rootScope.formLoading = true;

    $rootScope.getItem = function() {
        webServices.get('product/' + $stateParams.id).then(function(getData) {
           if (getData.status == 200) {
                $rootScope.viewData = getData.data;
                $rootScope.carouselItems = $rootScope.viewData.images;
                if (!$rootScope.viewData.userview) {
                    $scope.viewproduct();
                }
                $rootScope.redirectproduct = {};
                $rootScope.viewData.address = $rootScope.viewData.address.split(",").join(',<br/>');
                $rootScope.viewData.showExtra = 0;
                localStorage.redirectData = '';
                if ($rootScope.viewData.showmap) {
                    if($rootScope.viewData.postalcode){
                        $scope.getLatandLong($rootScope.viewData.postalcode +' , '+ $rootScope.viewData.address);
                    }else{
                        $scope.getLatandLong($rootScope.viewData.address);
                    }
                }
                console.log($rootScope.viewData)

                $timeout(function() {
                    $rootScope.$emit("reloadSlider", {});
                }, 1000);
            } else {
                $rootScope.logout();
            }
        });
    };

    $rootScope.showhideChat = function(){
        if ($rootScope.viewData.chatData) {
            if (Object.keys($rootScope.viewData.chatData).length > 0) {
                $state.go('app.productchat', { 'id': $rootScope.viewData.chatData.id });
            }
        }else{
            webServices.put('productchat/' + $rootScope.viewData.id).then(function(getData) {
                if (getData.status == 200) {
                    $state.go('app.productchat', { 'id': getData.data.id }); 
                }
            });
        }
    }

    $rootScope.setcommisionData = function() {
        $rootScope.commisionData = angular.copy($rootScope.viewData);
        if ($rootScope.commisionData.startdate) {
            $rootScope.commisionData.productstartdate = new Date($rootScope.commisionData.startdate);
        }
        if ($rootScope.commisionData.enddate) {
            $rootScope.commisionData.productenddate = new Date($rootScope.commisionData.enddate);
        }
        $rootScope.popupcarouselItems = $rootScope.commisionData.images;
        $rootScope.commisionData.counteroffer = 0;
        $rootScope.commisionData.isaccept = 0;
        $rootScope.formLoading = false;
        //$rootScope.commisionData.features = $rootScope.viewData.features;
    }

    $rootScope.showCommision = function() {
        $rootScope.formLoading = true;
        if (!$rootScope.viewData.commisionData) {
            $rootScope.isfirst = 1;
            $timeout(function() {
                $rootScope.commisionactive = 0;
                $scope.productData = {};
                $scope.productData.status = 1;
                $rootScope.formLoading = false;
                $rootScope.setcommisionData();
                $rootScope.openModalPopup('commisionModal');
            }, 2000);
        } else {
            $rootScope.isfirst = 0;
            webServices.get('commisionitem/' + $rootScope.viewData.commisionData.commisionitem[0].id).then(function(getData) {
                if (getData.status == 200) {
                    $rootScope.ResponseData = getData.data;
                    $rootScope.popupcarouselItems = $rootScope.ResponseData.commisionitem.productdetails.images;
                    $rootScope.ResponseData.showdetails = 1;
                    $rootScope.ResponseData.commisionactive = 0;
                    $rootScope.ResponseData.iscounter = 0;
                    if ($rootScope.ResponseData.startdate) {
                        $rootScope.ResponseData.productstartdate = new Date($rootScope.ResponseData.startdate);
                    }
                    if ($rootScope.ResponseData.enddate) {
                        $rootScope.ResponseData.productenddate = new Date($rootScope.ResponseData.enddate);
                    }
                    
                    $timeout(function() {
                        $rootScope.openModalPopup('responseModal');
                        $rootScope.formLoading = false;
                    }, 2000);
                }else
                {
                    $rootScope.logout();
                }
            });
        }
    }


    $scope.addTocart = function() {
                var status = 1;
                if($rootScope.viewData.cart){
                    if(Object.entries($rootScope.viewData.cart).length === 0){
                        status = 1;
                    }else{
                        if($rootScope.viewData.cart.status){
                            status = 0;
                        }
                    }
                }
                
                webServices.post('cart/' + $rootScope.viewData.id + '/' + status).then(function(getData) {
                    if (getData.status == 200) {
                        $rootScope.viewData.cart = getData.data.data;
                        $rootScope.$emit("showsuccessmsg", getData.data.message);
                    } else {
                        $rootScope.errors = [];
                        $rootScope.errors.push(getData.data.message);
                        $rootScope.$emit("showerrors", $rootScope.errors);
                    }
                });
            }

    $scope.updatewishstatus = function(){
        var obj = {};
        obj.productid = $rootScope.viewData.id;
        if($rootScope.viewData.wishstatus == 1){
            obj.wishstatus = 0;
        }else{
            obj.wishstatus = 1;
        }
    
        webServices.put('updatewish' , obj).then(function(getData) {
            if (getData.status == 200) {
                $rootScope.viewData.wishstatus = obj.wishstatus;
            }
        });
    }


    $scope.viewproduct = function() {
        webServices.put('viewproduct/' + $stateParams.id).then(function(getData) {
            if (getData.status == 200) {
                $rootScope.viewData.noofviews++;
            }
        });
    }

    $scope.changefollowstatus = function() {
        if ($scope.viewData.isfollow) {
            var status = 0;
        } else {
            var status = 1;
        }

        webServices.put('followstatus/' + $rootScope.viewData.owner.id + '/' + status).then(function(getData) {
            if (getData.status == 200) {
                $scope.viewData.isfollow = getData.data;
                if (status) {
                    $rootScope.viewData.owner.followers++;
                } else {
                    $rootScope.viewData.owner.followers--;
                }
            }
        });
    }

    $rootScope.editProduct = function() {
        $rootScope.iseditproduct = true;
        $rootScope.editproductid = $rootScope.viewData.id;
        $rootScope.openproductModal();
    }

    $rootScope.editRequest = function() {
        $rootScope.iseditproduct = true;
        $rootScope.editproductid = $rootScope.viewData.id;
        $rootScope.openRequestModal();
    }

    $scope.getLatandLong = function(address) {
        var geocoder = new google.maps.Geocoder();
        geocoder.geocode({
            'address': address
        }, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                $rootScope.viewData.latitude = results[0].geometry.location.lat();
                $rootScope.viewData.longitude = results[0].geometry.location.lng();
                $scope.geopos = angular.copy(app.geopos);

                $scope.customIcon = {
                    "scaledSize": [32, 32],
                    "url": "https://cdn2.iconfinder.com/data/icons/metro-uinvert-dock/256/Google_Maps.png"
                };
            } else {
                $rootScope.viewData.showmap = 0;
            }
        });
    }

    $scope.getItem();


}]);