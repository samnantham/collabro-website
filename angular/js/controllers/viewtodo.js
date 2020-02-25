'use strict';
app.controller('ViewTodoCtrl', ['$scope', '$http', '$state', '$stateParams', 'webServices', 'utility', '$rootScope', '$timeout', '$filter', '$firebaseArray', function($scope, $http, $state, $stateParams, webServices, utility, $rootScope, $timeout, $filter, $firebaseArray) {
    $rootScope.formLoading = true;
    $rootScope.todoData = {};

    $scope.getTodo = function() {
        webServices.get('todo/' + $stateParams.id).then(function(getData) {
            if (getData.status == 200) {
                $rootScope.todoData = getData.data;
                if($rootScope.todoData.type == 'Project'){
                    $rootScope.todoData.images = $rootScope.todoData.projectinfo.files;
                }
                localStorage.redirectData = '';
                $rootScope.formLoading = false;
            } else {
                $rootScope.logout();
            }
        });
    };

    $rootScope.editTodo = function(data) {
        $rootScope.isedittodo = true;
        $rootScope.edittodoid = data.id;
        $rootScope.opentodoModal();
    }

    $scope.deletetodo = function(todo) {
        $rootScope.itemkey = key;
        $rootScope.confirmData = {};
        $rootScope.confirmpopupData = {};
        $rootScope.confirmData.title = 'Remove todo item?';
        $rootScope.confirmData.message = 'You are about to remove this todo item. Are you sure you want to remove it?';
        $rootScope.confirmpopupData.id = todo.id;
        $rootScope.openConfirm();
    }

    $rootScope.removetodo = function(){
        webServices.delete('todo/' + $rootScope.confirmpopupData.id).then(function(getData) {
                            if (getData.status == 200) {
                                 $rootScope.closeModal();
                            }
                        });
    }

    $scope.getTodo();


}]);