'use strict';

/* Controllers */

angular.module('app')
    .controller('AppCtrl', ['$scope', '$location', '$sce', '$sessionStorage', '$window', 'webServices', 'utility', '$rootScope', '$state', '$timeout', '$aside', 'Facebook', 'GoogleSignin', 'authServices', 'isMobile', '$modal', '$filter', 'ngNotify', 'webNotification', 'bowser', '$document', '$ngConfirm',
        function($scope, $location, $sce, $sessionStorage, $window, webServices, utility, $rootScope, $state, $timeout, $aside, Facebook, GoogleSignin, authServices, isMobile, $modal, $filter, ngNotify, webNotification, bowser, $document, $ngConfirm, $modalStack) {
            $rootScope.isMobile = isMobile.phone;
            $rootScope.screenWidth = window.innerWidth;
            if ($rootScope.isMobile) {
                $rootScope.currentdevice = 'mobile';
            } else {
                $rootScope.currentdevice = 'desktop';
            }
            $rootScope.loginModel = {};
            $rootScope.registerModel = {};
            $rootScope.forgotModel = {};

            $rootScope.pwtype = "password";
            $rootScope.redirectproduct = {};
            $rootScope.notificationInterval = 6000;
            $rootScope.showheader = false;
            $rootScope.userData = {};
            $rootScope.shareData = {};
            $rootScope.user = {};
            $rootScope.chatImages = {};
            $rootScope.categories = [];
            $rootScope.validextensions = angular.copy(app.imgextensions);
            $rootScope.notauthroutes = angular.copy(app.notauthroutes);
            $rootScope.servicetypes = angular.copy(app.servicetypes);
            $rootScope.requestservicetypes = angular.copy(app.requestservicetypes);
            $rootScope.requestcategories = angular.copy(app.requestcategories);
            $rootScope.todotypes = angular.copy(app.todotypes);
            $rootScope.projecttypes = angular.copy(app.projecttypes);
            $rootScope.periodtypes = angular.copy(app.periodtypes);
            $rootScope.locations = angular.copy(app.locations);
            $rootScope.currencies = angular.copy(app.currencies);
            $rootScope.times = angular.copy(app.times);
            $rootScope.validextensions = angular.copy(app.imgextensions);
            $rootScope.professions = angular.copy(app.professions);
            $rootScope.rentaltypes = angular.copy(app.rentaltypes);
            $rootScope.eventtypes = angular.copy(app.eventtypes);
            $rootScope.maxUploadsize = angular.copy(app.maxUploadsize);
            $rootScope.redirectroutes = angular.copy(app.redirectroutes);
            $rootScope.categories = [];
            $rootScope.registerModel.iscompany = '0';
            $rootScope.thisyear = new Date().getFullYear();
            $rootScope.IMGURL = app.imageurl;
            $rootScope.keywords = []; /*['Make-Up Artist', 'Car Rental', 'Photography', 'Wardrobe', 'Interior Design', 'Trending Group', 'Decor and Lights', 'Wedding Gifts', 'Sparkling Shoes', 'Videography'];*/
            $rootScope.searchData = {};

            $rootScope.labels = ["Profit Earned", "Rental Earned", "Experience Points", "Advertisement Spent"];
            $rootScope.Colors = ["#ffc500", "#ff1561", "#59c74a", "#00d8ff"];
            $rootScope.ChartOptions = {
                cutoutPercentage: 70,
                responsive: true,
                elements: {
                    arc: {
                        borderWidth: 0
                    }
                },
                hover: {
                    mode: null
                },
                type: 'xppoints',
                plugins: {
                    labels: false
                },
                tooltips: {
                    enabled: false
                }
            };

            $rootScope.assignDoughnutdata = function() {
                Chart.pluginService.register({
                    beforeDraw: function(chart, easing) {
                        if (chart.config.options.type == 'xppoints') {
                            var width = chart.chart.width,
                                height = chart.chart.height,
                                ctx = chart.chart.ctx;

                            ctx.restore();
                            var fontSize = (height / 114).toFixed(2);
                            ctx.font = "normal 2em Roboto"; //"bold " + fontSize + "em Roboto";
                            ctx.textBaseline = "middle";

                            var text = $rootScope.user.experiencepoints,
                                textX = Math.round((width - ctx.measureText(text).width) / 2),
                                textY = height / 2;

                            ctx.fillStyle = '#004F5F';
                            ctx.fillText(text, textX, textY);
                            ctx.save();
                        }
                    }
                });
            }

            if (!localStorage.showheader) {
                $rootScope.showheader = true;
            }

            $rootScope.getSettings = function() {
                webServices.get('getsettings').then(function(getData) {
                    if (getData.status == 200) {
                        $rootScope.settings = getData.data;
                    }
                });
            }

            $rootScope.showhidepassword = function() {
                if ($rootScope.pwtype == "password") {
                    $rootScope.pwtype = 'text';
                } else {
                    $rootScope.pwtype = 'password';
                }
            }

            $rootScope.viewChatImg = function(img){
                var src = '<img src="'+ $rootScope.IMGURL + img +'">';
                $ngConfirm({
                    title: '',
                    //content: src,
                    contentUrl:'',
                    type: 'red',
                    typeAnimated: true,
                    closeIcon: true,
                    closeIconClass: 'modal-close',
                    buttons: {
                        white: {
                            text: 'Maximize',
                            btnClass: 'btn-green',
                            action: function (scope, button) {
                                this.setColumnClass('large');
                                button.setDisabled(true);
                                return false;
                            }
                        },
                        close: function () {
                        },
                    },
                });
            }

            $rootScope.openAuthModal = function(auth) {
                $rootScope.authLoading = true;
                $rootScope.currentauth = auth;
                $rootScope.loginModel = {};
                $timeout(function() {
                    $rootScope.authLoading = false;
                    $rootScope.dialogInst = $modal.open({
                        ariaLabelledBy: 'modal-title',
                        ariaDescribedBy: 'modal-body',
                        keyboard: false,
                        templateUrl: 'tpl/blocks/popover/authenticationpopover.html',
                        size: 'lg',
                        windowClass: 'authmodal',
                    });

                }, 1000);
            };

            $rootScope.changeauthTab = function(tab) {
                $rootScope.currentauth = tab;
                $rootScope.pwtype = 'password';
            }

            $rootScope.login = function(form) {
                $rootScope.loginerrors = {};
                $rootScope.errors = [];
                if (form.$valid) {
                    $rootScope.authloading = true;
                    $rootScope.loginLoading = true;
                    webServices.normalpost('login', $rootScope.userData).then(function(getData) {
                        $rootScope.loginLoading = false;
                        $rootScope.authloading = false;
                        if (getData.status == 200) {
                            $sessionStorage.user = getData.data;
                            localStorage.user = JSON.stringify($sessionStorage.user);
                            $rootScope.user = $sessionStorage.user;
                            if (!$rootScope.user.firebaseid) {
                                $rootScope.createFirebaseauth();
                            } else {
                                $rootScope.loginFirebaseauth();
                            }

                        } else {
                            $rootScope.loginerrors = getData.data.message;
                        }
                    });
                }
            };

            $rootScope.forgotpassword = function(form) {
                $rootScope.forgoterrors = {};
                if (form.$valid) {
                    $rootScope.forgotLoading = true;
                    $rootScope.authloading = true;
                    webServices.normalpost('forgotpassword', $rootScope.forgotModel).then(function(getData) {
                        $rootScope.authloading = false;
                        $rootScope.forgotLoading = false;
                        if (getData.status == 200) {
                            $rootScope.forgoterrors.successmsg = getData.data.message;
                        } else {
                            $rootScope.forgoterrors.errormsg = getData.data.message;
                        }
                    });
                }
            }

            $rootScope.$watch('formLoading', function() {
                if (!$rootScope.formLoading) {
                    if ($rootScope.notauthroutes.includes($rootScope.stateurl)) {
                        if ($rootScope.stateurl == 'app.searchitems') {
                            $rootScope.setSliderConfig();
                        }
                        if (localStorage.userData && !isMobile.phone) {
                            var userData = JSON.parse(localStorage.userData);
                            if (userData.rememberme == 1) {
                                $rootScope.userData = JSON.parse(localStorage.userData);
                            }
                        }
                    } else if ($rootScope.stateurl == 'app.usermain') {
                        $rootScope.setSliderConfig();
                    }
                }
                $timeout(function() {
                    $rootScope.$emit("callStickyMenu", {});
                }, 1000);
            });

            $rootScope.logintoProduct = function(product) {
                $rootScope.redirectproduct = {};
                $rootScope.redirectproduct = product;
                $rootScope.openAuthModal('login');
            }

            $rootScope.convertDate = function(date) {
                return Date.parse(date);
            }

            $rootScope.goback = function() {
                history.back();
            }

            $(window).resize(function() {
                $rootScope.screenWidth = window.innerWidth;
                $rootScope.setSliderConfig();
                if ($rootScope.screenWidth < 800) {
                    $rootScope.currentdevice = 'mobile';
                } else {
                    $rootScope.currentdevice = 'desktop';
                    $rootScope.setSliderConfig();
                }
            });

            $rootScope.setSliderConfig = function() {
                if (!isMobile.phone) {
                    if (($rootScope.screenWidth >= 960) && ($rootScope.screenWidth < 1151)) {
                        $rootScope.scrollslides = 3;
                        $rootScope.slidecount = 3;
                    } else if (($rootScope.screenWidth > 1151) && ($rootScope.screenWidth < 1320)) {
                        $rootScope.scrollslides = 4;
                        $rootScope.slidecount = 4;
                    } else if (($rootScope.screenWidth >= 1320) && ($rootScope.screenWidth < 1500)) {
                        $rootScope.scrollslides = 4;
                        $rootScope.slidecount = 4;
                    } else {
                        $rootScope.scrollslides = 4;
                        $rootScope.slidecount = 4;
                    }
                } else {
                    $rootScope.slidecount = 2;
                    $rootScope.scrollslides = 2;
                }

                $rootScope.slickConfig = {
                    enabled: true,
                    autoplay: false,
                    draggable: false,
                    slidesToShow: $rootScope.slidecount,
                    slidesToScroll: $rootScope.scrollslides,
                };
            }

            $rootScope.getUserInfo = function() {
                $rootScope.errors = [];
                webServices.get('getauthenticateduser').then(function(getData) {
                    if (getData.status == 200) {
                        $sessionStorage.user = getData.data;
                        localStorage.user = JSON.stringify($sessionStorage.user);
                        $rootScope.user = $sessionStorage.user;
                        var xppoints = $rootScope.user.experiencepoints * 100 / $rootScope.user.allowedXP;
                        $rootScope.chartdata = [0, 0, $rootScope.user.experiencepoints, 0];
                        $rootScope.assignDoughnutdata();
                    } else if (getData.status == 401) {
                        $rootScope.errors.push(getData.data.message);
                        $rootScope.$emit("showerrors", $rootScope.errors);
                        $rootScope.logout();
                    } else {
                        $rootScope.logout();
                    }
                });
            }


            $rootScope.setUserInfo = function() {
                if ($sessionStorage.user != null) {
                    $rootScope.user = authServices.currentUser();
                    $rootScope.chartdata = [0, 0, $rootScope.user.experiencepoints, 0];
                    $rootScope.assignDoughnutdata();
                } else if ((localStorage.user != '') && (localStorage.user != undefined) && (localStorage.user != 'undefined')) {
                    $rootScope.user = authServices.currentUser();
                    $rootScope.chartdata = [0, 0, $rootScope.user.experiencepoints, 0];
                    $rootScope.assignDoughnutdata();
                } else {
                    authServices.logout();
                }
            }


            $rootScope.getmyunreads = function() {
                webServices.get('myunreads').then(function(getData) {
                    if (getData.status == 200) {
                        $rootScope.countData = getData.data;
                        if (($rootScope.countData.chatmessages > $rootScope.user.chatmessages) || ($rootScope.countData.notifications > $rootScope.user.notifications)) {
                            $rootScope.showwebnotification();
                        }
                    } else {
                        $rootScope.logout();
                    }
                });
            }

            $rootScope.addTocart = function(product) {
                webServices.post('cart/' + product).then(function(getData) {
                    if (getData.status == 200) {
                        $rootScope.$emit("showsuccessmsg", getData.data.message);
                    } else {
                        $rootScope.errors = [];
                        $rootScope.errors.push(getData.data.message);
                        $rootScope.$emit("showerrors", $rootScope.errors);
                    }
                });
            }

            $rootScope.getCategories = function() {
                webServices.get('shopcategories').then(function(getData) {
                    if (getData.status == 200) {
                        $rootScope.categories = getData.data;
                        $rootScope.loading = false;
                    } else {
                        $rootScope.$emit("showerror", getData);
                    }
                });
            }

            $rootScope.closeheaderinfo = function() {
                localStorage.showheader = true;
                $rootScope.showheader = false;
            }

            $rootScope.googleLogin = function() {
                $rootScope.googleloading = true;
                $rootScope.authloading = true;
                GoogleSignin.signIn().then(function(user) {
                    var response = user.w3;
                    $rootScope.loginModel.email = response.U3;
                    $rootScope.loginModel.password = response.Eea;
                    $rootScope.loginModel.username = response.ig;
                    $rootScope.loginModel.register_type = 3;
                    $rootScope.loginModel.image = response.Paa;
                    $rootScope.sociallogin();
                }, function(err) {
                    $rootScope.googleloading = false;
                    $rootScope.authloading = false;
                    console.log(err);
                });
            }

            $rootScope.gotosearch = function(keyword) {
                $rootScope.searchData.keyword = keyword;
                $rootScope.showsearch = false;
                if ($rootScope.stateurl == 'app.home') {
                    $state.go('app.searchitems', {
                        'keyword': keyword,
                    });
                } else {
                    if ($rootScope.stateurl == 'app.home' || $rootScope.stateurl == 'app.main') {}
                    if (keyword && keyword.length > 0) {
                        if ($rootScope.stateurl == 'app.searchitems') {
                            $state.go('app.searchitems', {
                                'keyword': keyword,
                            });
                        } else {
                            $state.go('app.search', {
                                'keyword': keyword,
                            });
                        }
                    }
                }
            }

            $rootScope.searchedit = function() {
                $rootScope.showsearch = true;
            }

            $rootScope.facebooklogin = function() {
                $rootScope.facebookloading = true;
                $rootScope.authloading = true;
                Facebook.login(function(response) {
                    if (response.status == 'connected') {
                        $rootScope.logged = true;
                        $rootScope.me();
                    } else {
                        $rootScope.facebookloading = false;
                        $rootScope.authloading = false;
                    }

                });
            };

            $rootScope.me = function() {
                Facebook.api('/me?fields=name,email,picture', function(response) {
                    $rootScope.loginModel.email = response.email;
                    $rootScope.loginModel.password = response.id;
                    $rootScope.loginModel.username = response.name;
                    $rootScope.loginModel.register_type = 2;
                    $rootScope.loginModel.image = response.picture.data.url;
                    $rootScope.sociallogin();
                });
            };

            $rootScope.sociallogin = function(form) {
                webServices.normalpost('sociallogin', $rootScope.loginModel).then(function(getData) {
                    $rootScope.authloading = false;
                    $rootScope.googleloading = false;
                    $rootScope.facebookloading = false;
                    if (getData.status == 200) {
                        $sessionStorage.user = getData.data;
                        localStorage.user = JSON.stringify($sessionStorage.user);
                        $rootScope.user = $sessionStorage.user;
                        if (!$rootScope.user.firebaseid) {
                            $rootScope.createFirebaseauth();
                        } else {
                            $rootScope.goafterLogin();
                        }
                    } else {
                        $rootScope.loginerrors = getData.data.message;
                    }
                });
            };

            $rootScope.goafterLogin = function() {
                $rootScope.getUserInfo();
                $rootScope.closeModal();
                $rootScope.authloading = false;
                $rootScope.registerloading = false;
                $rootScope.googleloading = false;
                $rootScope.facebookloading = false;
                $rootScope.forgotLoading = false;
                $rootScope.loginModel = {};
                $rootScope.registerModel = {};
                $rootScope.forgotModel = {};
                $rootScope.searchData = {};
                if (Object.keys($rootScope.redirectproduct).length > 0) {
                    console.log($rootScope.redirectproduct)
                    $state.go('app.viewitem', {
                        'id': $rootScope.redirectproduct.id
                    });
                } else {
                    $state.go('app.usermain');
                }
            }

            $rootScope.createFirebaseauth = function() {
                firebase.auth().createUserWithEmailAndPassword($rootScope.user.email, 'password').then(function() {
                    $rootScope.loginFirebaseauth();
                }).catch(function(error) {
                    console.log(error);
                });
            }

            $rootScope.sharetwitter = function() {
                var newwindow = window.open('https://twitter.com/share?url=https://twitter.com/share?url=' + $rootScope.shareData.shareurl + $rootScope.shareData.id, 'Twitter Share', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=600,width=600');
                if (window.focus) {
                    newwindow.focus()
                }
                $timeout(function() {
                    $rootScope.updateforsocialshare(2);
                    $rootScope.closepopoverItem();
                }, 10000);
            }

            $rootScope.sharegoogle = function() {
                var newwindow = window.open('https://plus.google.com/share?url=' + $rootScope.shareData.shareurl + $rootScope.shareData.id, 'Google Share', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=600,width=600');
                if (window.focus) {
                    newwindow.focus()
                }
                $timeout(function() {
                    $rootScope.updateforsocialshare(3);
                    $rootScope.closepopoverItem();
                }, 10000);
            }

            $rootScope.sharewhatsapp = function() {
                /*if(isMobile.phone){*/
                var newwindow = window.open('https://api.whatsapp.com/send?text=' + encodeURIComponent($rootScope.shareData.shareurl + $rootScope.shareData.id), 'Whatsapp Share', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=600,width=600');
                if (window.focus) {
                    newwindow.focus()
                }
                $timeout(function() {
                    $rootScope.updateforsocialshare(4);
                    $rootScope.closepopoverItem();
                }, 5000);
                /*}*/

            }


            $rootScope.loginFirebaseauth = function() {
                firebase.auth().signInWithEmailAndPassword($rootScope.user.email, 'password').then(function() {
                    $rootScope.getFirebaseUser();
                }).catch(function(error) {
                    console.log(error);
                });
            }


            $rootScope.getFirebaseUser = function() {
                firebase.auth().onAuthStateChanged(function(user) {
                    if (!$rootScope.user.firebaseid) {
                        $rootScope.updatefirebaseid(user.uid)
                    } else {
                        $rootScope.goafterLogin();
                    }
                });
            }

            $rootScope.updatefirebaseid = function(firebaseid) {
                var obj = {
                    firebaseid: firebaseid
                };
                webServices.put('updatefirebaseid', obj).then(function(getData) {
                    if (getData.status == 200) {
                        $rootScope.goafterLogin();
                    } else {
                        $rootScope.authloading = false;
                        $rootScope.registerloading = false;
                        $rootScope.googleloading = false;
                        $rootScope.facebookloading = false;
                        $rootScope.forgotLoading = false;
                    }
                });
            }

            $rootScope.gettermsofservice = function() {
                webServices.get('termsofuse').then(function(getData) {
                    if (getData.status == 200) {
                        $rootScope.termsofuse = getData.data;
                    }
                });
            };

            $rootScope.$on("showsuccessmsg", function(event, msg) {
                ngNotify.set(msg, {
                    type: 'success',
                    theme: 'pastel',
                    position: 'bottom',
                    duration: 3000,
                    sticky: false,
                    button: true,
                    html: false
                });
            });

            $rootScope.$on("showerrormsg", function(event, msg) {
                ngNotify.set(msg, {
                    type: 'error',
                    theme: 'pastel',
                    position: 'bottom',
                    duration: 3000,
                    sticky: false,
                    button: true,
                    html: false
                });
            });

            $rootScope.$on("callStickyMenu", function() {
                if (!isMobile.phone) {
                    $('.leftSidebar, .content, .rightSidebar').theiaStickySidebar({
                        additionalMarginTop: 50
                    });
                }
            });


            $rootScope.getnotiCount = function() {
                if (authServices.isLoggedIn()) {
                    $rootScope.getmyunreads();
                }
                $timeout($rootScope.getnotiCount, $rootScope.notificationInterval);
            }

            $rootScope.showwebnotification = function() {
                var title = '';
                var message = '';
                if ($rootScope.countData.chatmessages > $rootScope.user.chatmessages) {
                    title += $rootScope.countData.chatmessages + ' new chats';
                }
                if ($rootScope.countData.notifications > $rootScope.user.notifications) {
                    if ($rootScope.countData.chatmessages > $rootScope.user.chatmessages) {
                        title += ' & '
                    }
                    title += $rootScope.countData.notifications + ' new notifications';
                }
                $rootScope.getUserInfo();

                webNotification.showNotification(title, {
                    body: 'You have a new message',
                    icon: 'img/favicon.ico',
                    onClick: function onNotificationClicked() {
                        console.log('Notification clicked.');
                    },
                    autoClose: 4000
                }, function onShow(error, hide) {
                    if (error) {
                        webNotification.requestPermission(function onRequest(granted) {
                            if (granted) {
                                console.log('Permission Granted.');
                            } else {
                                window.alert('Unable to show notification due to Permission issue');
                                console.log('Permission Not Granted.');
                            }
                        });
                    } else {
                        console.log('Notification Shown.');

                        setTimeout(function hideNotification() {
                            console.log('Hiding notification....');
                            hide(); //manually close the notification (you can skip this if you use the autoClose option)
                        }, 5000);
                    }
                });
            }

            $rootScope.$on("showerrors", function(event, errors) {
                angular.forEach(errors, function(errormsg, no) {
                    ngNotify.set(errormsg, {
                        type: 'error',
                        theme: 'pastel',
                        position: 'bottom',
                        duration: 3000,
                        sticky: false,
                        button: true,
                        html: false
                    });
                });
            });

            $rootScope.register = function(form) {
                $rootScope.registererrors = {};
                if (form.$valid) {
                    $rootScope.authloading = true;
                    $rootScope.registerloading = true;
                    $rootScope.registerModel.userrole = 2;
                    $rootScope.registerModel.register_type = 1;
                    $rootScope.registerModel.created_by = 1;
                    webServices.normalpost('userregister', $rootScope.registerModel).then(function(getData) {
                        if (getData.status == 200) {
                            $sessionStorage.user = getData.data;
                            localStorage.user = JSON.stringify($sessionStorage.user);
                            $rootScope.user = $sessionStorage.user;
                            $rootScope.createFirebaseauth();

                        } else {
                            $rootScope.authloading = false;
                            $rootScope.registerloading = false;
                            $rootScope.registererrors = getData.data.message;
                        }
                    });

                }
            };

            $rootScope.logout = function() {
                $rootScope.authloading = false;
                firebase.auth().signOut();
                $rootScope.userData = {};
                $rootScope.user = {};
                authServices.logout();
            }

            $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
                $rootScope.formLoading = true;
                $rootScope.stateurl = toState.name;
                if (!$rootScope.settings) {
                    $rootScope.getSettings();
                }
                /*if (authServices.isLoggedIn()) {
                    //$timeout($rootScope.getnotiCount, $rootScope.notificationInterval);
                }*/
                if ($rootScope.notauthroutes.includes($rootScope.stateurl)) {
                    if (authServices.isLoggedIn()) {
                        $rootScope.getUserInfo();
                        $timeout(function() {
                            $state.go('app.usermain');
                        }, 1000);
                    }
                } else {
                    $rootScope.getUserInfo();
                }
            });

            $rootScope.scrollTop = function() {
                $document.scrollTopAnimated(0, 2000).then(function() {
                    console && console.log('You just scrolled to the top!');
                });
            }

            $rootScope.checkDate = function(date) {
                var status = false;
                var varDate = new Date(date); //dd-mm-YYYY
                var yesterday = new Date();
                yesterday.setDate(yesterday.getDate() - 1);
                if(varDate > yesterday){
                    status = true;
                }
                return status;

            }


            $rootScope.closeModal = function() {
                $('.modal-content > .ng-scope').each(function() {
                    $(this).scope().$dismiss();
                });
            };

        }
    ]);