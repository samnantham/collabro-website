'use strict';
app.controller('CommisionModalCtrl',  ['$scope', '$timeout', '$state', '$stateParams', 'webServices', 'utility', '$rootScope', '$filter', '$modal', function($scope, $timeout, $state, $stateParams, webServices, utility, $rootScope, $filter, $modal) {
    
    $rootScope.openCommisionModal = function() {
        $rootScope.commisionactive = 0;
        $rootScope.formLoading = false;
        $rootScope.setcommisionData();
        $rootScope.openModalPopup('commisionmodal','CommisionModalCtrl');
    }

    $rootScope.showcheckTooltip = function(){
        if(!$rootScope.commisionData.isaccept){
            $rootScope.checkError = true;
        }
    }

    $rootScope.hidecheckTooltip = function(){
        $rootScope.checkError = false;
    }

    $rootScope.changecounterOffer = function() {
        $rootScope.formLoading = true;
        if($rootScope.commisionData.counteroffer){
            $rootScope.commisionData.counteroffer = 0;
        }else{
            $rootScope.commisionData.counteroffer = 1;
        }

        $timeout(function() {
            $rootScope.formLoading = false;
        }, 1000);
    }

    $rootScope.cancelCounteroffer = function(){
        $rootScope.formLoading = true;
        $rootScope.commisionData.counteroffer = 0;
        $timeout(function() {
            $rootScope.formLoading = false;
        }, 1000);
        
    }

    $rootScope.addcommisionFeature = function() {
        if ($rootScope.commisionData.featuretext) {
            var obj = {};
            obj.feature = $rootScope.commisionData.featuretext;
            $rootScope.commisionData.featuretext = "";
            $rootScope.commisionData.features.push(obj);
            $scope.productData.status = 0;
        }
    }

    $rootScope.removecommisionFeature = function(key) {
        $rootScope.commisionData.features.splice(key, 1);
        $scope.productData.status = 0;
    }

    $rootScope.changecommisionactive = function(key) {
        $rootScope.commisionactive = key;
    }

    $rootScope.sendcommisionData = function() {
        $rootScope.formLoading = true;
        $scope.productData = {};
        $scope.productData.productdetails = $rootScope.commisionData;
        $scope.productData.productid = $rootScope.commisionData.id;
        $scope.productData.ownerid = $rootScope.commisionData.ownerid;
        $scope.productData.buyerid = $rootScope.user.id;
        $scope.productData.buyercommisionstatus = 1;
        $scope.productData.status = 0;
        $scope.productData.isnew = $rootScope.isfirst;
        $scope.productData.iscounter = $rootScope.commisionData.counteroffer;
        if ($scope.commisionData.hasbargain) {
            $scope.productData.buyercommisionstatus = 3;
        }

        webServices.post('bargainproduct', $scope.productData).then(function(getData) {
            $rootScope.formLoading = false;
            if (getData.status == 200) {
                $scope.productData = {};
                $rootScope.closeModal();
                $state.reload();
            } else if (getData.status == 401) {
                $scope.errors = utility.getError(getData.data.message);
                $scope.showerrors();
            } else {
                $rootScope.$emit("showerror", getData);
            }
        });
    }
}]);