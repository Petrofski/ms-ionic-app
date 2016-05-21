// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services'])

.run(function($ionicPlatform, TokenService, $state) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

      var first = new Date();
      first.setHours(8);
      first.setMinutes(0);
      first.setSeconds(0);

      var second = new Date();
      second.setHours(13);
      second.setMinutes(0);
      second.setSeconds(0);

      var third = new Date();
      third.setHours(18);
      third.setMinutes(0);
      third.setSeconds(0);

      // 3 Daily Notifications
      window.plugin.notification.local.add({
          id:      1,
          title:   'Sensing MS',
          message: 'Enter your daily score please',
          repeat:  'daily',
          date:    first
      });

      window.plugin.notification.local.add({
          id:      2,
          title:   'Sensing MS',
          message: 'Enter your daily score please',
          repeat:  'daily',
          date:    second
      });

      window.plugin.notification.local.add({
          id:      3,
          title:   'Sensing MS',
          message: 'Enter your daily score please',
          repeat:  'daily',
          date:    third
      });

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });

})

.value("api", "http://sensing-ms-api.mybluemix.net/api/")

.config(function($stateProvider, $urlRouterProvider, $httpProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
  .state('login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'LoginCtrl'
  })


  .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  // Each tab has its own nav history stack:

  .state('tab.dash', {
    url: '/dash',
    views: {
      'tab-dash': {
        templateUrl: 'templates/tab-dash.html',
        controller: 'DashCtrl'
      }
    }
  })

  .state('tab.vas', {
      url: '/vas',
      views: {
        'tab-vas': {
          templateUrl: 'templates/tab-vas.html',
          controller: 'VasCtrl'
        }
      }
    })


  .state('tab.account', {
    url: '/account',
    views: {
      'tab-account': {
        templateUrl: 'templates/tab-account.html',
        controller: 'AccountCtrl'
      }
    }
  })

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');



});
