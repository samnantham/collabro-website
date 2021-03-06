app.controller('CollaborateModalCtrl', ['$scope', '$timeout', '$state', '$stateParams', 'webServices', 'utility', '$rootScope', '$filter', function($scope, $timeout, $state, $stateParams, webServices, utility, $rootScope, $filter) {
    $rootScope.activediv = 'info';
    var friends =  angular.copy($rootScope.user.myfriends);
    $rootScope.myfriends = angular.copy($rootScope.user.myfriends);

    $rootScope.resetProductItems = function() {
        $rootScope.loading = false;
        $rootScope.formData.isaccept = false;
        $rootScope.viewingThumb = {};
        $rootScope.formData.title = "";
        $rootScope.formData.memberlength = '';
        $rootScope.formData.productfile = '';
        $rootScope.activediv = 'info';
        $rootScope.formData.embedvideo = '';
        $rootScope.formData.images = [];
        $rootScope.formData.thumbimage = 0;
        $rootScope.formData.location = $scope.locations[0];
        
        if ($rootScope.fromfriendspage) {
            if($rootScope.formData.projectmembers.length > 0){
                angular.forEach($rootScope.myfriends, function(friend,no) {
                    if (friend.username == $rootScope.formData.projectmembers[0].username) {
                        $rootScope.myfriends.splice(no, 1);
                    }
                });
            }
        }
        $rootScope.hideerrors();
    }

    $rootScope.showTooltip = function(){
        if(!$rootScope.formData.type){
            $rootScope.showCatError = true;
        }
    }

    $rootScope.hideTooltip = function(){
        $rootScope.showCatError = false;
    }

    $rootScope.complete = function(string) {
        $rootScope.friends = [];
        if (string.length > 0) {
            angular.forEach(friends, function(friend) {
                if (friend.username.toLowerCase().includes(string.toLowerCase())) {
                    $rootScope.friends.push(friend);
                }
            });
        } else {
            $rootScope.friends = friends;
        }
    }

    $rootScope.addprojectfriend = function(friend) {
        if($rootScope.formData.projectmembers.length < 8){
            var status = false;
            angular.forEach($rootScope.formData.projectmembers, function(userfriend) {
                if (userfriend.id == friend.id) {
                    status = true;
                }
            });

            if(!status){
                $rootScope.selected = {};
                $rootScope.formData.projectmembers.push(friend);
                angular.forEach(friends, function(myfriend,key) {
                    if (myfriend.id == friend.id) {
                        friends.splice(key, 1);
                    }
                });
            }else{
                $rootScope.$emit("showerrormsg", 'Member Already Added');
            }
            
        }else{
            $rootScope.$emit("showerrormsg", 'Maximum 8 members only');
        }
        
    }

    $rootScope.removeprojectfriend = function(key, friend) {
        $rootScope.formData.projectmembers.splice(key, 1);
        friend.price = 0;
        $rootScope.myfriends.push(friend);
    }

    $rootScope.uploadvideo = function() {
        if (($rootScope.validURL($rootScope.formData.embedvideo))&&($rootScope.validvideo($rootScope.formData.embedvideo))) {
            $rootScope.viewingThumb = {};
            $rootScope.videoerror = false;
            var newobj = {};
            newobj.filetype = 2;
            newobj.file = $rootScope.formData.embedvideo;
            var thumbnail = $rootScope.formData.embedvideo;
            if ($rootScope.formData.embedvideo.includes('youtu')) {
                newobj.thumbnail = 'img/youtube.png';
            } else if ($rootScope.formData.embedvideo.includes('vimeo')) {
                newobj.thumbnail = 'img/vimeo.png';
            } else if ($rootScope.formData.embedvideo.includes('soundcloud')) {
                newobj.thumbnail = 'img/soundcloud.png';
            }
            if ($rootScope.editkey) {
                $rootScope.formData.images[$rootScope.editkey] = newobj;
                $rootScope.viewingThumb = newobj;
                $rootScope.formData.thumbimage = $rootScope.selectedKey;
                $rootScope.selectedKey = null;
                $rootScope.editkey = null;
            } else {
                if ($rootScope.formData.images.length < 6) {
                    $rootScope.formData.images.push(newobj);
                    $rootScope.viewingThumb = $rootScope.formData.images[$rootScope.formData.images.length - 1];
                    $rootScope.formData.thumbimage = $rootScope.formData.images.length - 1;
                    $rootScope.selectedKey = null;
                    $rootScope.editkey = null;
                } else if ($rootScope.formData.images.length >= 6) {
                    $rootScope.$emit("showerrormsg", 'Already 6 items uploaded.');
                }
            }
            $rootScope.formData.embedvideo = '';
        }
        else{
            $rootScope.$emit("showerrormsg", 'Please upload valid video url.');
            $rootScope.formData.embedvideo = '';
        }
    }

    $rootScope.changeVideo = function(key) {
        $rootScope.editkey = key;
        $rootScope.formData.embedvideo = $rootScope.formData.images[$rootScope.selectedKey].file;
        $rootScope.ismodalPopover = false;
    }

    
    $rootScope.chooseItem = function(key) {
        $rootScope.ismodalPopover = true;
        $rootScope.selectedKey = key;
        $rootScope.formData.thumbimage = $rootScope.selectedKey;
        if ($rootScope.formData.images[$rootScope.selectedKey].filetype == 1) {
            $rootScope.formData.embedvideo = "";
        }
        $rootScope.viewingThumb = $rootScope.formData.images[$rootScope.selectedKey];
    }

    $rootScope.closeItem = function() {
        $rootScope.ismodalPopover = false;
        $rootScope.viewingThumb = {};
        $rootScope.selectedKey = null;
        $rootScope.editkey = null;
    }

    $rootScope.closeModalPopover = function() {
        if ($rootScope.ismodalPopover) {
            $rootScope.ismodalPopover = false;
            $rootScope.selectedKey = null;
            $rootScope.editkey = null;
            $rootScope.viewingThumb = {};
        }
    }

    $rootScope.removefileItem = function() {
        $rootScope.formData.images.splice($rootScope.selectedKey, 1);
        $rootScope.ismodalPopover = false;
        $rootScope.viewingThumb = {};
        $rootScope.selectedKey = null;
        $rootScope.editkey = null;
    }


    $rootScope.onFocus = function (e) {
        $timeout(function () {
          $(e.target).trigger('input');
          $(e.target).trigger('change'); // for IE
        });
    };

    $rootScope.stateComparator = function (state, viewValue) {
        return viewValue === '[$empty$]' || (''+state).toLowerCase().indexOf((''+viewValue).toLowerCase()) > -1;
    };


    $rootScope.changeactiveDiv = function(div) {
        if(div == 'members'){
            $rootScope.opened = true;
        }else{
            $rootScope.opened = false;
        }
        $rootScope.activediv = div;
    }

    $scope.createProject = function(form) {
        $rootScope.hideerrors();
        if (form.$valid) {
            $rootScope.formLoading = true;
            $rootScope.formData.thumbkey = $rootScope.formData.thumbimage;
            if($rootScope.formData.projectdeadline.includes('/')){
                var date = $rootScope.formData.projectdeadline.split("/")
                $rootScope.formData.deadline = $filter('date')(new Date(date[2], date[1] - 1, date[0]), 'yyyy-MM-dd');
            }else{
                $rootScope.formData.deadline = $filter('date')($rootScope.todoData.projectdeadline, 'yyyy-MM-dd');
            }

            webServices.upload('project', $rootScope.formData).then(function(getData) {
                $rootScope.fromfriendspage = false;
                if (getData.status == 200) {
                    $rootScope.closeModal();
                    $rootScope.$emit("showsuccessmsg", getData.data.message);
                    $rootScope.formData = {};
                    if ($rootScope.iseditproject) {
                        $timeout(function() {
                            $state.reload();
                        }, 500);
                    }else{
                        $state.go('app.projectdetails',{'id':getData.data.data.id});
                    }
                } else if (getData.status == 401) {
                    $scope.errors = utility.getError(getData.data.message);
                    $rootScope.$emit("showerrors", $rootScope.errors);
                } else {
                    $rootScope.$emit("showerror", getData);
                }
            });
        } else {
            if (!form.productfile.$valid) {
                $rootScope.imageerrormsg = "(Upload Images or add Video)";
                $rootScope.imageerror = true;
            }
            if (!form.title.$valid) {
                $rootScope.titleerror = true;
                $rootScope.noinfoerror = false;
            }
            if (!form.description.$valid) {
                $rootScope.descriptionerror = true;
                $rootScope.noinfoerror = false;
            }
            if (!form.deadline.$valid) {
                $rootScope.deadlineerror = true;
                $rootScope.noinfoerror = false;
            }

            if (!form.members.$valid) {
                $rootScope.membererror = true;
                if ($rootScope.noinfoerror) {
                    $rootScope.activediv = 'members';
                }
            }

            if (!$rootScope.noinfoerror) {
                $rootScope.activediv = 'info';
            }

        }
    }

    $rootScope.hideerrors = function() {
        $rootScope.imageerrormsg = "";
        $rootScope.noinfoerror = true;
        $rootScope.nomemberserror = true;
        $rootScope.titleerror = false;
        $rootScope.descriptionerror = false;
        $rootScope.imageerror = false;
        $rootScope.deadlineerror = false;
        $rootScope.membererror = false;
    }

    $rootScope.replaceImage = function(files,key) {
        if (files && files.length) {
            $rootScope.editkey = key;
            var extn = files[0].name.split(".").pop();
            if ($rootScope.validextensions.includes(extn.toLowerCase())) {
                if (files[0].size <= $rootScope.maxUploadsize) {
                    var newobj = {};
                    newobj.file = files[0];
                    newobj.filename = files[0].name;
                    newobj.filetype = 1;
                    newobj.isfile = 1;
                    $rootScope.viewingThumb = newobj;
                    $rootScope.formData.images[$rootScope.editkey] = newobj;
                    $rootScope.formData.thumbimage = angular.copy($rootScope.editkey);
                } else {
                    $rootScope.$emit("showerrormsg", files[i].name + ' size exceeds 2MB.');
                }
            } else {
                $rootScope.$emit("showerrormsg", files[i].name + ' format unsupported.');
            }
            $rootScope.ismodalPopover = false;
        }
    }


     $rootScope.addImages = function(files) {
        $rootScope.selectedKey = null;
        $rootScope.imageerrormsg = "";
        $rootScope.viewingThumb = {};
        $rootScope.errors = [];
        var remainingimages = 6 - $rootScope.formData.images.length;
        if (files.length <= remainingimages) {
            if (files && files.length) {
                for (var i = 0; i < files.length; i++) {
                    var extn = files[i].name.split(".").pop();
                    if ($rootScope.validextensions.includes(extn.toLowerCase())) {
                        if (files[i].size <= $rootScope.maxUploadsize) {
                            var newobj = {};
                            newobj.file = files[i];
                            newobj.filename = files[i].name;
                            newobj.filetype = 1;
                            newobj.isfile = 1;
                            $rootScope.formData.images.push(newobj);
                            $rootScope.viewingThumb = $rootScope.formData.images[$rootScope.formData.images.length - 1];
                            $rootScope.formData.thumbimage = $rootScope.formData.images.length - 1;
                        } else {
                            $rootScope.$emit("showerrormsg", files[i].name + ' size exceeds 2MB.');
                        }
                    } else {
                        $rootScope.$emit("showerrormsg", files[i].name + ' format unsupported.');
                    }
                }
                if ($rootScope.errors.length > 0) {
                    angular.forEach($rootScope.errors, function(error, no) {
                        if (no == 0) {
                            $rootScope.imageerrormsg += error;
                        } else {
                            $rootScope.imageerrormsg += ' & ' + error;
                        }
                    });
                    $rootScope.imageerror = true;
                }
            }
        } else {
            files = null;
            $rootScope.$emit("showerrormsg", 'Now you can upload maximum of ' + remainingimages + ' images only.');
        }
    }


    if ($rootScope.iseditproject) {
        $rootScope.selected = {};
        webServices.get('project/' + $rootScope.editprojectid).then(function(getData) {
            if (getData.status == 200) {
                $rootScope.formData = getData.data;
                $rootScope.formData.projectdeadline = $filter('date')(new Date($rootScope.formData.deadline), 'dd/MM/yyyy');
                $rootScope.formData.thumbimage = 0;
                $rootScope.formData.projectmembers = [];
                $rootScope.formData.images = $rootScope.formData.files;
                $rootScope.viewingThumb = $rootScope.formData.images[0];
                
                 angular.forEach($rootScope.formData.members, function(promember) {
                    angular.forEach($rootScope.myfriends, function(member,index) {
                        if (member.id == promember.userid) {
                            var newmember = member;
                            newmember.price = promember.price;
                            $rootScope.formData.projectmembers.push(newmember);
                            $rootScope.myfriends.splice(index, 1);
                        }
                    });
                });
                 console.log($rootScope.formData)
            } else {
                $rootScope.logout();
            }
        });
    }else{
        
        if (!$rootScope.fromfriendspage) {
            $rootScope.formData = {};
            $rootScope.formData.images = [];
            $rootScope.formData.type = '';
            $rootScope.formData.projectmembers = [];
        }
        $rootScope.resetProductItems();
    }

}]);