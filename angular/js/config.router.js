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
                        templateUrl: layout
                    })

                /*Only Desktop Routes*/

                if (!isMobile.phone) {
                    $stateProvider
                        .state('app.main', {
                            title:'Main',
                            url: '/main',
                            templateUrl: 'tpl/desktop/noauth/main.html',
                            resolve: load(['js/controllers/main.js'])
                        })

                    .state('app.searchitems', {
                        title:'Search',
                        url: '/searchitems/:keyword',
                        templateUrl: 'tpl/desktop/noauth/searchitem.html',
                        resolve: load(['js/controllers/searchitem.js'])
                    })

                    .state('app.viewproduct', {
                        title:'Product',
                        url: '/viewproduct/:id',
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
                            templateUrl: 'tpl/mobile/mobilemain.html',
                            resolve: load(['js/controllers/home.js'])
                        })

                    .state('app.forgotpassword', {
                        url: '/forgotpassword',
                        templateUrl: 'tpl/mobile/forgotpassword.html',
                        resolve: load(['js/controllers/home.js'])
                    })

                    .state('app.signup', {
                        url: '/signup',
                        templateUrl: 'tpl/mobile/signup.html',
                        resolve: load(['js/controllers/home.js'])
                    })

                    /*.state('app.addproduct', {
                        url: '/addproduct',
                        templateUrl: 'tpl/mobile/addproduct.html',
                        resolve: load(['js/productmodal.js'])
                    })

                    .state('app.editproduct', {
                        url: '/editproduct/:id',
                        templateUrl: 'tpl/mobile/addproduct.html',
                        resolve: load(['js/productmodal.js'])
                    })

                    .state('app.addproject', {
                        url: '/addproject',
                        templateUrl: 'tpl/mobile/addproject.html',
                        resolve: load(['js/productmodal.js'])
                    })*/

                    .state('app.userproducts', {
                        url: '/userproducts/:id',
                        templateUrl: 'tpl/mobile/userproducts.html',
                        resolve: load(['js/controllers/viewuser.js'])
                    })

                    /*.state('app.addbroadcast', {
                        url: '/addbroadcast',
                        templateUrl: 'tpl/mobile/addbroadcast.html',
                        resolve: load(['js/productmodal.js'])
                    })*/
                }

                /*Only Mobile Routes*/

                /*Common Routes*/
                $stateProvider
                    .state('app.home', {
                        title:'Home',
                        url: '/home',
                        templateUrl: 'tpl/' + folderpath + '/noauth/home.html',
                        resolve: load(['js/controllers/home.js'])
                    })

                .state('app.usermain', {
                    title:'Main',
                    url: '/usermain',
                    templateUrl: 'tpl/' + folderpath + '/usermain.html',
                    resolve: load(['js/controllers/usermain.js'])
                })

                .state('app.search', {
                    title:'Search',
                    url: '/search/:keyword',
                    templateUrl: 'tpl/' + folderpath + '/search.html',
                    resolve: load(['js/controllers/search.js'])
                })

                .state('app.notification', {
                    title:'Notification',
                    url: '/notification',
                    templateUrl: 'tpl/' + folderpath + '/notification.html',
                    resolve: load(['cp.ngConfirm', 'js/controllers/notification.js'])
                })

                .state('app.chats', {
                    title:'Chats',
                    url: '/userchats',
                    templateUrl: 'tpl/' + folderpath + '/chats.html',
                    resolve: load(['cp.ngConfirm', 'js/controllers/chats.js'])
                })

                .state('app.feeds', {
                    title:'Feeds',
                    url: '/feeds',
                    templateUrl: 'tpl/' + folderpath + '/feeds.html',
                    resolve: load(['cp.ngConfirm', 'js/controllers/feeds.js'])
                })

                .state('app.userchat', {
                    title:'Private Chat',
                    url: '/privatechat/:chatid',
                    templateUrl: 'tpl/' + folderpath + '/userchat.html',
                    resolve: load(['js/controllers/userchat.js'])
                })

                .state('app.feedchat', {
                    title:'Feed Chat',
                    url: '/feedchat/:chatid',
                    templateUrl: 'tpl/' + folderpath + '/feedchat.html',
                    resolve: load(['cp.ngConfirm', 'js/controllers/feedchat.js'])
                })

                .state('app.viewitem', {
                    title:'Item Info',
                    url: '/viewitem/:id',
                    templateUrl: 'tpl/' + folderpath + '/viewitem.html',
                    resolve: load(['ngMap','js/controllers/viewitem.js'])
                })

                .state('app.viewtodo', {
                    title:'Todo Info',
                    url: '/viewtodo/:id',
                    templateUrl: 'tpl/' + folderpath + '/viewtodo.html',
                    resolve: load(['cp.ngConfirm', 'js/controllers/viewtodo.js'])
                })

                .state('app.viewfeed', {
                    title:'Feed Info',
                    url: '/viewfeed/:id',
                    templateUrl: 'tpl/' + folderpath + '/viewfeed.html',
                    resolve: load(['cp.ngConfirm', 'js/controllers/viewfeed.js'])
                })

                .state('app.productchat', {
                    title:'Product Discussion',
                    url: '/productchat/:id',
                    templateUrl: 'tpl/' + folderpath + '/productchat.html',
                    resolve: load(['js/controllers/productchat.js'])
                })

                .state('app.wishlist', {
                    title:'Wishlist',
                    url: '/wishlist',
                    templateUrl: 'tpl/' + folderpath + '/wishlist.html',
                    resolve: load(['cp.ngConfirm', 'js/controllers/wishlist.js'])
                })

                .state('app.projectlist', {
                    title:'Projects',
                    url: '/projectlist',
                    templateUrl: 'tpl/' + folderpath + '/projectlist.html',
                    resolve: load(['js/controllers/projectlist.js'])
                })

                .state('app.todos', {
                    title:'Todos',
                    url: '/todos',
                    templateUrl: 'tpl/' + folderpath + '/todos.html',
                    resolve: load(['cp.ngConfirm', 'js/controllers/todos.js'])
                })

                .state('app.projectdetails', {
                    title:'Project Info',
                    url: '/projectdetails/:id',
                    templateUrl: 'tpl/' + folderpath + '/projectdetails.html',
                    resolve: load(['js/controllers/projectdetails.js'])
                })

                .state('app.myfriends', {
                    title:'Friends',
                    url: '/myfriends',
                    templateUrl: 'tpl/' + folderpath + '/friends.html',
                    resolve: load(['js/controllers/friends.js'])
                })

                .state('app.mydashboard', {
                    title:'Dashboard',
                    url: '/mydashboard',
                    templateUrl: 'tpl/' + folderpath + '/dashboard.html',
                    resolve: load(['cp.ngConfirm', 'js/controllers/dashboard.js'])
                })

                .state('app.viewuser', {
                    title:'User Info',
                    url: '/viewuser/:id',
                    templateUrl: 'tpl/' + folderpath + '/viewuser.html',
                    resolve: load(['js/controllers/viewuser.js'])
                })

                //CMS Pages

                .state('app.howitworks', {
                    title:'How It Works',
                    url: '/howitworks',
                    templateUrl: 'tpl/' + folderpath + '/cms/howitworks.html',
                    resolve: load(['js/controllers/cms/howitworks.js'])
                })

                .state('app.rewardsandbenefits', {
                    title:'Rewards & Benefits',
                    url: '/rewardsandbenefits',
                    templateUrl: 'tpl/' + folderpath + '/cms/rewardsandbenefits.html',
                    resolve: load(['js/controllers/cms/rewardsandbenefits.js'])
                })

                .state('app.openshop', {
                    title:'Open Shop',
                    url: '/openshop',
                    templateUrl: 'tpl/' + folderpath + '/cms/openshop.html',
                    resolve: load(['js/controllers/cms/openshop.js'])
                })

                .state('app.becomepartner', {
                    title:'Become a Partner',
                    url: '/becomepartner',
                    templateUrl: 'tpl/' + folderpath + '/cms/becomepartner.html',
                    resolve: load(['js/controllers/cms/becomepartner.js'])
                })

                .state('app.affiliationprogram', {
                    title:'Affiliation Program',
                    url: '/affiliationprogram',
                    templateUrl: 'tpl/' + folderpath + '/cms/affiliationprogram.html',
                    resolve: load(['js/controllers/cms/affiliationprogram.js'])
                })

                .state('app.bonuscredit', {
                    title:'Bonus Credit',
                    url: '/bonuscredit',
                    templateUrl: 'tpl/' + folderpath + '/cms/bonuscredit.html',
                    resolve: load(['js/controllers/cms/bonuscredit.js'])
                })

                .state('app.licenceandlegal', {
                    title:'Licence & Legal',
                    url: '/licenceandlegal',
                    templateUrl: 'tpl/' + folderpath + '/cms/licenceandlegal.html',
                    resolve: load(['js/controllers/cms/licenceandlegal.js'])
                })

                .state('app.discussionsandforums', {
                    title:'Discussions & Forums',
                    url: '/discussionsandforums',
                    templateUrl: 'tpl/' + folderpath + '/cms/discussionsandforums.html',
                    resolve: load(['js/controllers/cms/discussionsandforums.js'])
                })

                .state('app.collectioncenter', {
                    title:'Collection Center',
                    url: '/collectioncenter',
                    templateUrl: 'tpl/' + folderpath + '/cms/collectioncenter.html',
                    resolve: load(['js/controllers/cms/collectioncenter.js'])
                })

                .state('app.helpcenter', {
                    title:'Help Center',
                    url: '/helpcenter',
                    templateUrl: 'tpl/' + folderpath + '/cms/helpcenter.html',
                    resolve: load(['js/controllers/cms/helpcenter.js'])
                })

                .state('app.collaboraonservice', {
                    title:'Collaboration Service',
                    url: '/collaborationservice',
                    templateUrl: 'tpl/' + folderpath + '/cms/collaboraonservice.html',
                    resolve: load(['js/controllers/cms/collaboraonservice.js'])
                })

                .state('app.sitemap', {
                    title:'Sitemap',
                    url: '/sitemap',
                    templateUrl: 'tpl/' + folderpath + '/cms/sitemap.html',
                    resolve: load(['js/controllers/cms/sitemap.js'])
                })

                 .state('app.brand', {
                    title:'Brand',
                    url: '/brand',
                    templateUrl: 'tpl/' + folderpath + '/cms/brand.html',
                    resolve: load(['js/controllers/cms/brand.js'])
                })

                 .state('app.termsandconditions', {
                    title:'Terms & Conditions',
                    url: '/termsandconditions',
                    templateUrl: 'tpl/' + folderpath + '/cms/termsandconditions.html',
                    resolve: load(['js/controllers/cms/termsandconditions.js'])
                })

                .state('app.cookypolicy', {
                    title:'Cooky Policy',
                    url: '/cookypolicy',
                    templateUrl: 'tpl/' + folderpath + '/cms/cookypolicy.html',
                    resolve: load(['js/controllers/cms/cookypolicy.js'])
                })

                .state('app.privacypolicy', {
                    title:'Privacy Policy',
                    url: '/privacypolicy',
                    templateUrl: 'tpl/' + folderpath + '/cms/privacypolicy.html',
                    resolve: load(['js/controllers/cms/privacypolicy.js'])
                })

                .state('app.careers', {
                    title:'Careers',
                    url: '/careers',
                    templateUrl: 'tpl/' + folderpath + '/cms/careers.html',
                    resolve: load(['js/controllers/cms/careers.js'])
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