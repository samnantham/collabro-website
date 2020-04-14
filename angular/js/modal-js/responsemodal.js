app.controller('ResponseModalCtrl', ['$scope', '$timeout', '$state', '$stateParams', 'webServices', 'utility', '$rootScope', '$filter', function($scope, $timeout, $state, $stateParams, webServices, utility, $rootScope, $filter) {
	
    $scope.productData = {};
    var proData = angular.copy($rootScope.ResponseData);
    var newproData = angular.copy(proData);
    
    $rootScope.rejectOffer = function() {
        $rootScope.formLoading = true;
        if (!$rootScope.ResponseData.isreject) {
            $rootScope.ResponseData.isreject = 1;
            $rootScope.ResponseData.reason = '';
            if ($rootScope.ResponseData.ownerid == $rootScope.user.id) {
                $scope.productData.ownercommisionstatus = 2;
            }
            if ($rootScope.ResponseData.buyerid == $rootScope.user.id) {
                $scope.productData.buyercommisionstatus = 2;
            }
        } else {
            $scope.productData.status = 2;
            if ($rootScope.ResponseData.reason) {
                $scope.productData.reason = $rootScope.ResponseData.reason;
                $scope.productData.comments = $rootScope.ResponseData.comments;
                $rootScope.sendresponseData();
            }
        }
        $timeout(function() {
            $rootScope.formLoading = false;
        }, 1000);
    }

    $rootScope.acceptOffer = function() {
        $rootScope.formLoading = true;
        if($rootScope.ResponseData.isacceptoffer){
            $rootScope.ResponseData.isacceptoffer = 0;
        }else{
            $rootScope.ResponseData.isacceptoffer = 1;
        }
        $timeout(function() {
            $rootScope.formLoading = false;
        }, 1000);
    }

    $rootScope.counterOffer = function() {
        $rootScope.formLoading = true;
        if($rootScope.ResponseData.iscounter){
            $rootScope.ResponseData.iscounter = 0;
        }else{
            $rootScope.ResponseData.iscounter = 1;
        }

        console.log($rootScope.ResponseData)
        $timeout(function() {
            $rootScope.formLoading = false;
        }, 1000);
    }

    $rootScope.proceedBargain = function() {
        $scope.productData.status = 0;
        if ($rootScope.ResponseData.ownerid == $rootScope.user.id) {
            $scope.productData.ownercommisionstatus = 3;
        }
        if ($rootScope.ResponseData.buyerid == $rootScope.user.id) {
            $scope.productData.buyercommisionstatus = 3;
        }
        $rootScope.sendresponseData();
    }

    $rootScope.proceedRequest = function(){
        if($rootScope.ResponseData.isacceptoffer){
            $rootScope.proceedData();
        }else{
            $rootScope.proceedBargain();
        }
    }

    $rootScope.cancelRequest = function(){
        $rootScope.formLoading = true;
        $rootScope.ResponseData.isreject = 0;
        $rootScope.ResponseData.iscounter = 0;
        $rootScope.ResponseData.isacceptoffer = 0;
        $rootScope.ResponseData.agreeterms = 1;
        $timeout(function() {
            $rootScope.formLoading = false;
        }, 1000);
        
    }

    $rootScope.sendresponseData = function() {
        $rootScope.formLoading = true;
        $scope.productData.commisionid = $rootScope.ResponseData.id;
        $scope.productData.productdetails = $rootScope.ResponseData.commisionitem.productdetails;
        $scope.productData.productid = $rootScope.ResponseData.productid;
        $scope.productData.ownerid = $rootScope.ResponseData.ownerid;
        $scope.productData.buyerid = $rootScope.ResponseData.buyerid;
        $scope.productData.notificationid = $rootScope.ResponseData.notificationid;

        webServices.post('bargainproduct', $scope.productData).then(function(getData) {
            $rootScope.formLoading = false;
            if (getData.status == 200) {
                $scope.productData = {};
                $rootScope.ResponseData = {};
                $rootScope.closeModal();
            } else if (getData.status == 401) {
                $scope.errors = utility.getError(getData.data.message);
                $scope.showerrors();
            } else {
                $rootScope.$emit("showerror", getData);
            }
        });
    }

    $rootScope.proceedData = function() {
        $scope.productData.status = 1;
        if ($rootScope.ResponseData.ownerid == $rootScope.user.id) {
            $scope.productData.ownercommisionstatus = 1;
        }
        if ($rootScope.ResponseData.buyerid == $rootScope.user.id) {
            $scope.productData.buyercommisionstatus = 1;
        }
        $rootScope.sendresponseData();
    }

    $rootScope.showcheckTooltip = function(){
        if(!$rootScope.ResponseData.agreeterms){
            $rootScope.checkError = true;
        }
    }

    $rootScope.hidecheckTooltip = function(){
        $rootScope.checkError = false;
    }

    
}]);