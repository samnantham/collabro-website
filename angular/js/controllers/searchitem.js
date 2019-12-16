'use strict';
app.controller('SearchItemPageCtrl', ['$scope', '$modal', '$document', '$state', '$timeout', 'webServices', 'utility', '$rootScope', '$stateParams', function($scope, $modal, $document, $state, $timeout, webServices, utility, $rootScope, $stateParams) {

    $scope.searchpageData = {};
    $scope.searchpageData.type = '';
    $scope.searchpageData.service = {};
    $scope.searchpageData.shop = {};
    $scope.searchpageData.rental = {};
    $scope.searchpageData.event = {};
    $scope.categories = [];
    $scope.keyword = $stateParams.keyword;
    $rootScope.searchData.keyword = $stateParams.keyword;
    $scope.activetab = 'all';
    if($scope.keyword){
        $scope.searchpageData.keyword =  $scope.keyword;
    }
    $rootScope.searchproductslick = {
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        fade: true,
        asNavFor: '.slider-nav',
        method: {},
        event: {
            afterChange: function(event, slick, currentSlide, nextSlide) {
                $scope.slickCurrentIndex2 = currentSlide;
            },
            init: function(event, slick) {
                slick.slickGoTo($scope.slickCurrentIndex2); // slide to correct index when init
            }
        }
    };

    $scope.setactivetab = function(tab) {
        if (tab != $scope.activetab) {
            $rootScope.formLoading = true;
            $scope.products = [];
            $scope.activetab = tab;
            if ($scope.activetab == 'all') {
                $scope.searchpageData.type = '';
                $scope.getproducts();
            } else {
                $scope.searchpageData.type = tab;
                $scope.getproducts();
            }
        }
    }

    $scope.showItem = function(item) {
        $rootScope.formData = {};
        $rootScope.formData = item;
        $timeout(function() {
            $scope.dialogInst = $modal.open({
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                keyboard: false,
                templateUrl: 'tpl/blocks/modals/popovermodal.html',
                size: 'lg',
                windowClass: 'popovermodal',
            });

        }, 1000);
    };

    $scope.getproducts = function() {
        $rootScope.formLoading = true;
        webServices.post('webportal/searchproducts',$scope.searchpageData).then(function(getData) {
            if (getData.status == 200) {
                $scope.products = getData.data;
                $rootScope.formLoading = false;
                var top = 0;
                var duration = 2000; //milliseconds

                //Scroll to the exact position
                $document.scrollTopAnimated(top, duration).then(function() {
                  console && console.log('You just scrolled to the top!');
                });
            }
        });
    };

    $scope.sortproduct = function(type, key, order) {
        $scope.searchpageData[type.toLowerCase()].sortkey = key;
        $scope.searchpageData[type.toLowerCase()].sortorder = order;
        $scope.getproducts();
    }

    $scope.filterproduct = function(type, category) {
        $scope.searchpageData[type.toLowerCase()].category = category;
        $scope.getproducts();
    }

    $scope.getCategories = function() {
        webServices.get('shopcategories').then(function(getData) {
            if (getData.status == 200) {
                $scope.categories = getData.data;
                $scope.getproducts();
            } else {
                $rootScope.logout();
            }
        });
    }

    $scope.getCategories();
}]);