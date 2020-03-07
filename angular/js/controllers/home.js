'use strict';
app.controller('HomeCtrl', ['$scope', '$state', '$rootScope', '$timeout', 'webServices', function($scope, $state, $rootScope, $timeout, webServices) {

    $rootScope.formLoading = true;

    $scope.skitterOption = {
        auto_play: true,
        navigation: true,
        dots: false,
        fullscreen: true,
        interval: 4000,
        theme: 'square',
        label_animation:'fixed',
        with_animations: ['swapBars', 'swapBarsBack', 'swapBlocks']
        //with_animations: ['cube', 'cubeRandom', 'block', 'cubeStop', 'cubeStopRandom', 'cubeHide', 'cubeSize', 'horizontal', 'showBars', 'showBarsRandom', 'tube', 'fade', 'fadeFour', 'paralell', 'blind', 'blindHeight', 'blindWidth', 'directionTop', 'directionBottom', 'directionRight', 'directionLeft', 'cubeSpread', 'glassCube', 'glassBlock', 'circles', 'circlesInside', 'circlesRotate', 'cubeShow', 'upBars', 'downBars', 'hideBars', 'swapBars', 'swapBarsBack', 'swapBlocks', 'cut']
    }

    $scope.getBanners = function() {
        $scope.photos = [];
        webServices.get('getbanners').then(function(getData) {
            $rootScope.formLoading = false;
                $rootScope.$emit("scrolltop", "search-page");
            
            if (getData.status == 200) {
                angular.forEach(getData.data , function(data, no) {
                    var obj = {};
                    obj.src = $rootScope.IMGURL + data.image;
                    obj.title = data.banner_main_text;
                    obj.description = data.banner_sub_text;
                    obj.button = data.button_text;
                    obj.url = data.link;
                    $scope.photos.push(obj);
                });
            } else {
                $rootScope.logout();
            }
        });
    };

    if ($rootScope.currentdevice == 'desktop') {
        $scope.getBanners();
    } else {
        $timeout(function() {
            $rootScope.formLoading = false;
        }, 2000);
    }
}]);