'use strict';
app.controller('TodoListCtrl', ['$scope', '$state', '$timeout', 'webServices', 'utility', '$rootScope', '$stateParams', function($scope, $state, $timeout, webServices, utility, $rootScope, $stateParams) {
    
    $scope.todos = [];
    $scope.todospagedata = [];
    $scope.pageno = 1;
    $scope.totalPerPage = 10;
    $scope.url = 'mytodos/' + $scope.totalPerPage;

    $scope.getmytodos = function() {
        webServices.get($scope.url + '?page=' + $scope.pageno).then(function(getData) {
            if (getData.status == 200) {
                $scope.pagination = {
                    current: $scope.pageno
                };
                $scope.todospagedata[$scope.pageno] = getData.data;
                $scope.todos = getData.data;
                angular.forEach($scope.todos.data, function(todo, no) {
                    if(todo.type == 'Project'){
                        todo.images = todo.projectinfo.files;
                    }
                });
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

    $rootScope.filterTodo = function(filter){
        $rootScope.formLoading = true;
        if(filter){
            $scope.url = 'mytodos/' + $scope.totalPerPage + '/' +filter;
        }else{
            $scope.url = 'mytodos/' + $scope.totalPerPage;
        }
        $scope.getmytodos();
    }

    $scope.pageChanged = function(newPage) {
        $scope.pageno = newPage;
        if (!$scope.todospagedata[$scope.pageno]) {
            $scope.getmytodos();
        } else {
            $scope.todos = $scope.todospagedata[$scope.pageno];
        }
    };

    $scope.getmyprojects = function() {
        webServices.get('allmyprojects').then(function(getData) {
            if (getData.status == 200) {
                $rootScope.myprojects = getData.data;
                console.log($rootScope.myprojects)
                $scope.getmytodos();
            } else {
                $rootScope.logout();
            }
        });
    };

    $scope.deletetodo = function(key, todo) {
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
                                $scope.todos.data.splice($rootScope.itemkey, 1); 
                            }
                        });
    }

    $scope.getmyprojects();

}]);