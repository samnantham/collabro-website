'use strict';
app.controller('RequestModalCtrl', ['$scope', '$timeout', '$state', '$stateParams', 'webServices', 'utility', '$rootScope', '$filter', '$modal', function($scope, $timeout, $state, $stateParams, webServices, utility, $rootScope, $filter, $modal) {
    $rootScope.viewingThumb = {};

    $rootScope.resetRequestData = function() {
        $rootScope.showCatError = false;
        $rootScope.checkError = false;
        $rootScope.viewingThumb = {};
        $rootScope.formData.request_type = "Service";
        $rootScope.formData.categoryText = 'Please select Category';
        $rootScope.formData.productfile = '';
        $rootScope.formData.title = "";
        $rootScope.formData.description = "";
        $rootScope.formData.embedvideo = '';
        $rootScope.formData.hasbargain = 0;
        $rootScope.formData.isaccept = 0;
        $rootScope.formData.images = [];
        $rootScope.formData.thumbimage = 0;
        $rootScope.formData.currency = $scope.currencies[0];
        $rootScope.formData.periodtype = $scope.periodtypes[0];
        $rootScope.hideerrors();
    }

    $rootScope.changeVideo = function(key) {
        $rootScope.editkey = key;
        $rootScope.formData.embedvideo = $rootScope.formData.images[$rootScope.selectedKey].file;
        $rootScope.ismodalPopover = false;
    }

    $rootScope.uploadvideo = function() {
        if (($rootScope.validURL($rootScope.formData.embedvideo)) && ($rootScope.validvideo($rootScope.formData.embedvideo))) {
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
        } else {
            $rootScope.$emit("showerrormsg", 'Please upload valid video url.');
            $rootScope.formData.embedvideo = '';
        }
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

    $rootScope.viewThumb = function() {
        $rootScope.ismodalPopover = false;
        $rootScope.viewingThumb = $rootScope.formData.images[$rootScope.selectedKey];
    }

    $rootScope.replaceImage = function(files, key) {
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
                    $rootScope.broadcastData.images[$rootScope.editkey] = newobj;
                    $rootScope.broadcastData.thumbimage = angular.copy($rootScope.editkey);
                } else {
                    $rootScope.$emit("showerrormsg", files[i].name + ' size exceeds 2MB.');
                }
            } else {
                $rootScope.$emit("showerrormsg", files[i].name + ' format unsupported.');
            }
            $rootScope.ismodalPopover = false;
        }
    }

    $scope.addData = function(form) {
        $rootScope.hideerrors();
        if (form.$valid) {
            $rootScope.formLoading = true;
            $rootScope.formData.thumbkey = $rootScope.formData.thumbimage;
            $rootScope.formData.is_request = 1;
            $rootScope.formData.is_request = 1;
            $rootScope.formData.deadline = $filter('date')(new Date($rootScope.formData.requestdeadline), 'yyyy-MM-dd');
            webServices.upload('request', $rootScope.formData).then(function(getData) {
                $rootScope.formLoading = false;
                console.log(getData)
                if (getData.status == 200) {
                    $rootScope.closeModal();
                    $rootScope.$emit("showsuccessmsg", getData.data.message);
                    if ($rootScope.iseditproduct) {
                        $state.reload();
                    }
                } else if (getData.status == 401) {
                    $rootScope.$emit("showerror", getData);
                } else {
                    $rootScope.$emit("showerror", getData);
                }
            });
        } else {
            if (!form.productfile.$valid) {
                $rootScope.imageerror = true;
            }
            if (!form.title.$valid) {
                $rootScope.titleerror = true;
            }
            if (!form.description.$valid) {
                $rootScope.descriptionerror = true;
            }
            if (!form.price.$valid) {
                $rootScope.priceerror = true;
            }
            if (!form.deadline.$valid) {
                $rootScope.deadlineerror = true;
            }
        }
    }

    $rootScope.hideerrors = function() {
        $rootScope.titleerror = false;
        $rootScope.descriptionerror = false;
        $rootScope.deadlineerror = false;
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

    if ($rootScope.iseditproduct) {
        webServices.get('product/' + $rootScope.editproductid).then(function(getData) {
            if (getData.status == 200) {
                $rootScope.formData = getData.data;
                $rootScope.formData.requestdeadline = $filter('date')(new Date($rootScope.formData.deadline), 'MM/dd/yyyy');
                $rootScope.formData.price = parseFloat($rootScope.formData.price);
                $rootScope.formData.thumbimage = 0;
                $rootScope.viewingThumb = $rootScope.formData.images[0];

                console.log($rootScope.formData)
            } else {
                $rootScope.logout();
            }
        });
    } else {
        $rootScope.formData = {};
        $rootScope.resetRequestData();
    }

    $rootScope.showTooltip = function(){
        if(!$rootScope.formData.request_category){
            $rootScope.showCatError = true;
        }
    }

    $rootScope.hideTooltip = function(){
        $rootScope.showCatError = false;
    }

    $rootScope.showcheckTooltip = function(){
        if(!$rootScope.formData.isaccept){
            $rootScope.checkError = true;
        }
    }

    $rootScope.hidecheckTooltip = function(){
        $rootScope.checkError = false;
    }

}]);