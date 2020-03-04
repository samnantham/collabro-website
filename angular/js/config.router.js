'use strict';

/**
 * Config for the rou++++++++++++++
 */
angular.module('app')
    .run(
        ['$rootScope', '$state', '$stateParams',
            function($rootScope, $state, $stateParams) {
                $rootScope.$state = $state;
                $rootScope.$stateParams = $stateParams;
            }
        ]
    )
    .config(
        ['$stateProvider', '$urlRouterProvider', '$locationProvider', 'JQ_CONFIG', 'MODULE_CONFIG', 'isMobileProvider',
            function($stateProvider, $urlRouterProvider, $locationProvider, JQ_CONFIG, MODULE_CONFIG, isMobile) {

                var base = '';
                var layout = "tpl/blocks/app.html";
                var current_url = window.location.href;

                if (isMobile.phone) {
                    var base = '/mobile';
                    var folderpath = 'mobile';
                    if (!current_url.includes('mobile')) {
                        var parts = current_url.split('/');
                        if (current_url.includes('responsive')) {
                            window.open(current_url.replace('responsive', 'responsive/mobile'), "_self");
                        }
                    }
                    $urlRouterProvider.otherwise('/mobile/mobilemain');
                } else {
                    var folderpath = 'desktop';
                    $urlRouterProvider.otherwise(base + '/home');
                }

                $locationProvider.html5Mode({ enabled: true,  requireBase: false }).hashPrefix('!');

                $stateProvider
                    .state('app', {
                        abstract: true,
                        url: base,
                        cache: false,
                        templateUrl: layout
                    })

                /*Only Desktop Routes*/

                if (!isMobile.phone) {
                    $stateProvider
                        .state('app.main', {
                            url: '/main',
                            cache: false,
                            templateUrl: 'tpl/desktop/noauth/main.html',
                            resolve: load(['js/controllers/main.js'])
                        })

                    .state('app.searchitems', {
                        url: '/searchitems/:keyword',
                        cache: false,
                        templateUrl: 'tpl/desktop/noauth/searchitem.html',
                        resolve: load(['js/controllers/searchitem.js'])
                    })

                    .state('app.viewproduct', {
                        url: '/viewproduct/:id',
                        cache: false,
                        templateUrl: 'tpl/desktop/noauth/viewproduct.html',
                        resolve: load(['js/controllers/viewproduct.js'])
                    })
                }
                /*Only Desktop Routes*/

                /*Only Mobile Routes*/

                if (isMobile.phone) {
                    $stateProvider
                        .state('app.mobilemain', {
                            url: '/mobilemain',
                            cache: false,
                            templateUrl: 'tpl/mobile/mobilemain.html',
                            resolve: load(['js/controllers/home.js'])
                        })

                    .state('app.forgotpassword', {
                        url: '/forgotpassword',
                        cache: false,
                        templateUrl: 'tpl/mobile/forgotpassword.html',
                        resolve: load(['js/controllers/home.js'])
                    })

                    .state('app.signup', {
                        url: '/signup',
                        cache: false,
                        templateUrl: 'tpl/mobile/signup.html',
                        resolve: load(['js/controllers/home.js'])
                    })

                    /*.state('app.addproduct', {
                        url: '/addproduct',
                        cache: false,
                        templateUrl: 'tpl/mobile/addproduct.html',
                        resolve: load(['js/productmodal.js'])
                    })

                    .state('app.editproduct', {
                        url: '/editproduct/:id',
                        cache: false,
                        templateUrl: 'tpl/mobile/addproduct.html',
                        resolve: load(['js/productmodal.js'])
                    })

                    .state('app.addproject', {
                        url: '/addproject',
                        cache: false,
                        templateUrl: 'tpl/mobile/addproject.html',
                        resolve: load(['js/productmodal.js'])
                    })*/

                    .state('app.userproducts', {
                        url: '/userproducts/:id',
                        cache: false,
                        templateUrl: 'tpl/mobile/userproducts.html',
                        resolve: load(['js/controllers/viewuser.js'])
                    })

                    /*.state('app.addbroadcast', {
                        url: '/addbroadcast',
                        cache: false,
                        templateUrl: 'tpl/mobile/addbroadcast.html',
                        resolve: load(['js/productmodal.js'])
                    })*/
                }

                /*Only Mobile Routes*/

                /*Common Routes*/
                $stateProvider
                    .state('app.home', {
                        url: '/home',
                        cache: false,
                        templateUrl: 'tpl/' + folderpath + '/noauth/home.html',
                        resolve: load(['js/controllers/home.js'])
                    })

                .state('app.usermain', {
                    url: '/usermain',
                    cache: false,
                    templateUrl: 'tpl/' + folderpath + '/usermain.html',
                    resolve: load(['js/controllers/usermain.js'])
                })

                .state('app.search', {
                    url: '/search/:keyword',
                    cache: false,
                    templateUrl: 'tpl/' + folderpath + '/search.html',
                    resolve: load(['js/controllers/search.js'])
                })

                .state('app.notification', {
                    url: '/notification',
                    cache: false,
                    templateUrl: 'tpl/' + folderpath + '/notification.html',
                    resolve: load(['cp.ngConfirm', 'js/controllers/notification.js'])
                })

                .state('app.chats', {
                    url: '/userchats',
                    cache: false,
                    templateUrl: 'tpl/' + folderpath + '/chats.html',
                    resolve: load(['cp.ngConfirm', 'js/controllers/chats.js'])
                })

                .state('app.feeds', {
                    url: '/feeds',
                    cache: false,
                    templateUrl: 'tpl/' + folderpath + '/feeds.html',
                    resolve: load(['cp.ngConfirm', 'js/controllers/feeds.js'])
                })

                .state('app.userchat', {
                    url: '/privatechat/:chatid',
                    cache: false,
                    templateUrl: 'tpl/' + folderpath + '/userchat.html',
                    resolve: load(['js/controllers/userchat.js'])
                })

                .state('app.feedchat', {
                    url: '/feedchat/:chatid',
                    cache: false,
                    templateUrl: 'tpl/' + folderpath + '/feedchat.html',
                    resolve: load(['cp.ngConfirm', 'js/controllers/feedchat.js'])
                })

                .state('app.viewitem', {
                    url: '/viewitem/:id',
                    cache: false,
                    cache: false,
                    templateUrl: 'tpl/' + folderpath + '/viewitem.html',
                    resolve: load(['ngMap', 'js/controllers/viewitem.js'])
                })

                .state('app.viewtodo', {
                    url: '/viewtodo/:id',
                    cache: false,
                    templateUrl: 'tpl/' + folderpath + '/viewtodo.html',
                    resolve: load(['cp.ngConfirm', 'js/controllers/viewtodo.js'])
                })

                .state('app.viewfeed', {
                    url: '/viewfeed/:id',
                    cache: false,
                    templateUrl: 'tpl/' + folderpath + '/viewfeed.html',
                    resolve: load(['cp.ngConfirm', 'js/controllers/viewfeed.js'])
                })

                .state('app.productchat', {
                    url: '/productchat/:id',
                    cache: false,
                    templateUrl: 'tpl/' + folderpath + '/productchat.html',
                    resolve: load(['js/controllers/productchat.js'])
                })

                .state('app.wishlist', {
                    url: '/wishlist',
                    cache: false,
                    templateUrl: 'tpl/' + folderpath + '/wishlist.html',
                    resolve: load(['cp.ngConfirm', 'js/controllers/wishlist.js'])
                })

                .state('app.projectlist', {
                    url: '/projectlist',
                    cache: false,
                    templateUrl: 'tpl/' + folderpath + '/projectlist.html',
                    resolve: load(['js/controllers/projectlist.js'])
                })

                .state('app.todos', {
                    url: '/todos',
                    cache: false,
                    templateUrl: 'tpl/' + folderpath + '/todos.html',
                    resolve: load(['cp.ngConfirm', 'js/controllers/todos.js'])
                })

                .state('app.projectdetails', {
                    url: '/projectdetails/:id',
                    cache: false,
                    templateUrl: 'tpl/' + folderpath + '/projectdetails.html',
                    resolve: load(['js/controllers/projectdetails.js'])
                })

                .state('app.myfriends', {
                    url: '/myfriends',
                    cache: false,
                    templateUrl: 'tpl/' + folderpath + '/friends.html',
                    resolve: load(['js/controllers/friends.js'])
                })

                .state('app.mydashboard', {
                    url: '/mydashboard',
                    cache: false,
                    templateUrl: 'tpl/' + folderpath + '/dashboard.html',
                    resolve: load(['cp.ngConfirm', 'js/controllers/dashboard.js'])
                })

                .state('app.viewuser', {
                    url: '/viewuser/:id',
                    cache: false,
                    templateUrl: 'tpl/' + folderpath + '/viewuser.html',
                    resolve: load(['js/controllers/viewuser.js'])
                })

                .state('app.howitworks', {
                    url: '/howitworks',
                    cache: false,
                    templateUrl: 'tpl/' + folderpath + '/cms/howitworks.html',
                    resolve: load(['js/controllers/howitworks.js'])
                })

                .state('app.rewardsandbenefits', {
                    url: '/rewardsandbenefits',
                    cache: false,
                    templateUrl: 'tpl/' + folderpath + '/cms/rewardsandbenefits.html',
                    resolve: load(['js/controllers/rewardsandbenefits.js'])
                })
                
                /*Common Routes*/

                function load(srcs, callback) {
                    return {
                        deps: ['$ocLazyLoad', '$q',
                            function($ocLazyLoad, $q) {
                                var deferred = $q.defer();
                                var promise = false;
                                srcs = angular.isArray(srcs) ? srcs : srcs.split(/\s+/);
                                if (!promise) {
                                    promise = deferred.promise;
                                }
                                angular.forEach(srcs, function(src) {
                                    promise = promise.then(function() {
                                        if (JQ_CONFIG[src]) {
                                            return $ocLazyLoad.load(JQ_CONFIG[src]);
                                        }
                                        angular.forEach(MODULE_CONFIG, function(module) {
                                            if (module.name == src) {
                                                name = module.name;
                                            } else {
                                                name = src;
                                            }
                                        });
                                        return $ocLazyLoad.load(name);
                                    });
                                });
                                deferred.resolve();
                                return callback ? promise.then(function() {
                                    return callback();
                                }) : promise;
                            }
                        ]
                    }
                }
            }
        ]
    );