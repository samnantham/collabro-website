'use strict';
app.controller('CollaborateResponseModalCtrl', ['$scope', '$http', '$state', 'authServices', '$sessionStorage', 'webServices', 'utility', '$rootScope', 'Facebook', 'GoogleSignin', function($scope, $http, $state, authServices, $sessionStorage, webServices, utility, $rootScope, Facebook, GoogleSignin) {

    $rootScope.showcheckTooltip = function(){
        if(!$rootScope.notificationprojectData.isaccept){
            $rootScope.checkError = true;
        }
    }

    $rootScope.hidecheckTooltip = function(){
        $rootScope.checkError = false;
    }

    $rootScope.acceptcollaboration = function() {
        $rootScope.formLoading = true;
        webServices.put('acceptmembercollaboration/' + $rootScope.notificationprojectData.member.id).then(function(getData) {
            if (getData.status == 200) {
                $rootScope.formLoading = false;
                $rootScope.closeModal();
                $rootScope.$emit("showsuccessmsg", 'Project confirmation sent to Co-ordinator successfully');
            }
        });
    };

}]);