// lazyload config
angular.module('app')

    .constant('JQ_CONFIG', {
        
    })
    .constant('MODULE_CONFIG', [
        {
          name: 'ngMap',
          files: [
              'https://maps.googleapis.com/maps/api/js?callback=map&key=AIzaSyClK5WNPCHNH316bn-fudiLgL96Fyo5DTU&libraries=places',
              'libs/map/ng-map.min.js'
          ]
        },
      {
          name: 'chart.js',
          files: [
              'libs/chart/chart.min.js',
              'libs/chart/angular-chart.min.js',
              'libs/chart/chartjs-plugin-labels.js'
          ]
      },
      {
        name: 'cp.ngConfirm',
          files: [
              'libs/confirm/angular-confirm.css',
              'libs/confirm/angular-confirm.js',
          ]
      }
      
      ])
    // oclazyload config
    .config(['$ocLazyLoadProvider', 'MODULE_CONFIG', function($ocLazyLoadProvider, MODULE_CONFIG) {
        // We configure ocLazyLoad to use the lib script.js as the async loader
        $ocLazyLoadProvider.config({
            debug: false,
            events: true,
            modules: MODULE_CONFIG
        });
    }]);