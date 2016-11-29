// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
(function(){
    angular.module('starter', ['ui.router'])

        // .run(function ($ionicPlatform) {
        //     $ionicPlatform.ready(function () {
        //         // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        //         // for form inputs)
        //         if (window.cordova && window.cordova.plugins.Keyboard) {
        //             cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        //             cordova.plugins.Keyboard.disableScroll(true);
        //
        //         }
        //         if (window.StatusBar) {
        //             // org.apache.cordova.statusbar required
        //             StatusBar.styleDefault();
        //         }
        //     });
        // })

        .config(function ($stateProvider, $urlRouterProvider) {
            $stateProvider

                .state('app', {
                    url: "/app",
                    abstract: true,
                    templateUrl: "templates/menu.html",
                    controller: 'menuController',
                    controllerAs: 'menu'
                })

                .state('login',{
                    url: "/login",
                    templateUrl: "templates/login.html",
                    controller: 'loginController',
                    controllerAs: 'vm'
                })

                .state('app.locations', {
                    url: "/locations",
                    views: {
                        'menuContent': {
                            templateUrl: "templates/locations.html",
                            controller: 'locationListController',
                            controllerAs: 'loc'
                        }
                    }
                })

                .state('app.homebase', {
                    url: "/homebase",
                    views: {
                        'menuContent': {
                            templateUrl: "templates/homebase.html",
                            controller: 'homebaseController',
                            controllerAs: 'hb'
                        }
                    }
                })

                .state('app.inventory', {
                    url: "/inventory",
                    views: {
                        'menuContent': {
                            templateUrl: "templates/inventory.html",
                            controller: 'invController',
                            controllerAs: 'fl'
                        }
                    }
                });

            $urlRouterProvider.otherwise('/login');
        });
})();

var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');

// Connection URL
var url = 'mongodb://localhost:27017/myproject';

// Use connect method to connect to the server
MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  console.log("Connected successfully to the server");

  db.close();
});




