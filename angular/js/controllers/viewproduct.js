'use strict';
app.controller('ViewProductCtrl', ['$scope', '$modal', 'authServices', '$state', '$timeout', 'webServices', 'utility', '$rootScope', '$stateParams', function($scope, $modal, authServices, $state, $timeout, webServices, utility, $rootScope, $stateParams) {
    
    

    $scope.skitterOption = {
        auto_play: true,
        navigation: true,
        dots: false,
        fullscreen: true,
        interval: 4000,
        theme: 'square',
        label_animation:'fixed',
        with_animations: ['swapBars', 'swapBarsBack', 'swapBlocks']
        }

    $scope.getBanners = function() {
        $scope.photos = [];
        webServices.get('getbanners').then(function(getData) {
            if (getData.status == 200) {
                $scope.getItem();
                angular.forEach(getData.data , function(data, no) {
                    var obj = {};
                    obj.src = $rootScope.IMGURL + data.image;
                    obj.title = data.banner_main_text;
                    obj.description = data.banner_sub_text;
                    obj.button = data.button_text;
                    obj.url = data.link;
                    $scope.photos.push(obj);
                });
                console.log($scope.photos)
            } else {
                $rootScope.logout();
            }
        });
    };
    
    $rootScope.popOverCarousel = {
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

    $rootScope.popOverThumbCarousel = {
                focusOnSelect: true,
                infinite: false,
                initialSlide: 0,
                slidesToShow: 5,
                asNavFor: '.slider-for',
                slidesToScroll: 1,
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


    $scope.showItem = function(item) {
        $rootScope.formLoading = false;
        $rootScope.popOverData = {};
        $rootScope.popOverData = item;
        $timeout(function() {
            $rootScope.dialogInst = $modal.open({
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                keyboard: false,
                animation: true,
                templateUrl: 'tpl/blocks/popover/productpopover.html',
                size: 'lg',
                windowClass: 'search-preview-modal',
            });

        }, 1000);
    };

    $scope.getItem = function() {
        webServices.get('showproduct/' + $stateParams.id).then(function(getData) {
            if (getData.status == 200) {
                console.log(authServices.isLoggedIn())
                if (authServices.isLoggedIn()) {
                    $state.go('app.viewitem', {
                        'id': $stateParams.id
                    });
                }else{
                    $scope.showItem(getData.data);
                }
            }
        });
    };

    $scope.getBanners();

}]);
