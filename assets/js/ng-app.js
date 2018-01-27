'use strict';
var path = require('path');



import './../bower/angular/angular.min.js';
// import Dropzone from './../bower/dropzone/dist/min/dropzone-amd-module.min.js';
import './../bower/angularfire/dist/angularfire.min.js';
import './../bower/angular-route/angular-route.min.js';
import './../bower/angular-animate/angular-animate.min.js';
import './../bower/angular-xeditable/dist/js/xeditable.js';
import './../bower/slick-carousel/slick/slick.min.js';
import './../bower/angular-moment-filter/index.js';
// import './../bower/angular-slick-carousel/dist/angular-slick.js';

// Dropzone.autoDiscover = false;

function here(d) {
	if (!d){ return __dirname; }
	return path.resolve(__dirname, d);
}


window.app = angular.module('appName',[
	"ngRoute",
	"firebase",
	'xeditable',
	"moment-filter"
]);

// check "$requireSignIn" when changing routes
// https://github.com/firebase/angularfire/blob/master/docs/guide/user-auth.md#ngroute-example
app.run(["$rootScope", "$location", function($rootScope, $location) {
	// console.log($location.$$path);
  $rootScope.$on("$routeChangeError", function(event, next, previous, error) {
    if (error === "AUTH_REQUIRED") {
      $location.path("/login");
      $rootScope.notice('user-times',"<a href=\"/login\">login</a> to Chat", "I need to know who you are.")
      console.log('AUTH_REQUIRED')
    }
  });
}]);

app.config(function ($httpProvider) {
  $httpProvider.defaults.headers.common = {};
  $httpProvider.defaults.headers.post = {};
  $httpProvider.defaults.headers.put = {};
  $httpProvider.defaults.headers.patch = {};
});


// editableOptions
app.run(['editableOptions', function(editableOptions) {
  // editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
  editableOptions.buttons="no"
  editableOptions.isDisabled=true;
}]);


// routes
app.config(function ($routeProvider, $locationProvider){
	$routeProvider
		.when('/projects', {
			controller: 'projects',
			templateUrl: 'partials/views/projects.html',
			activeClass: 'projects'
		})
		.when('/project/:p', {
			controller: 'projects',
			templateUrl: 'partials/views/project-single.html',
			activeClass: 'projects',
			activetab: 'projects'
		})
		.when('/gallery/:project_id/:indx', {
			controller: 'gallery',
			templateUrl: 'partials/views/project-gal.html',
			activeClass: 'projects',
			activetab: 'projects'
		})
		.when('/mobile', {
			controller: 'mobile',
			templateUrl: 'partials/views/mobile.html',
			activeClass: 'mobile'
		})
		.when('/privacy', {
			templateUrl: 'partials/views/privacy.html',
		})
		.when('/downloads', {
			controller: 'downloads',
			templateUrl: 'partials/views/downloads.html',
			activeClass: 'downloads'
		})
		.when('/skills', {
			controller: 'skills',
			templateUrl: 'partials/views/skills.html',
			activeClass: 'skills'
		})
		.when('/settings', {
			controller: 'settings',
			templateUrl: 'partials/views/settings.html',
			activeClass: 'settings'
		})
		.when('/login', {
			controller: 'auth',
			templateUrl: 'partials/views/auth.html',
			activeClass: 'auth'
		})
		.when('/', {
			controller: 'mission',
			templateUrl: 'partials/views/mission.html',
			activeClass: 'mission'
		})
		.when('/chat', {
			controller: 'chat',
			templateUrl: 'partials/views/chat.html',
			activeClass: 'chat',
			resolve: {
				"currentAuth": ["Auth", function(Auth) {return Auth.$requireSignIn(); }]
			}
		})
		.when('/master-chat', {
			controller: 'chat',
			templateUrl: 'partials/views/master-chat.html',
			activeClass: 'master-chat',
			activetab: 'master-chat',
			resolve: {
				"currentAuth": ["Auth", function(Auth) {return Auth.$requireSignIn(); }]
			}
		})
		.when('/faq', {
			controller: 'faq',
			templateUrl: 'partials/views/faq.html',
			activeClass: 'faq'
		})
		.otherwise({
			templateUrl:'partials/views/404.html'
		});	
		$locationProvider.html5Mode(true);
});


// reverse in ng-repeat
app.filter('reverse', function() {
  return function(items) {
    return items.slice().reverse();
  };
});


// auth
app.factory("Auth", ["$firebaseAuth",
  function($firebaseAuth) {
    return $firebaseAuth();
  }
]);

// lazy
app.directive('lazy', function($timeout) {
    return {
      restrict: 'C',
      link: function (scope, elm) {
        $timeout(function() {
          $(elm).lazyload({
            effect: 'fadeIn',
            effectspeed: 500,
            event: 'loadImage',
            'skip_invisible': false
          });
        }, 1000);
      }
    };
  });


require('./ng-controller.js');