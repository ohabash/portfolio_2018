
app.controller('settings', function ($scope, $rootScope, $location) {
	console.log("ng-chat.js");
	$rootScope.ACTIVE();


	$scope.bgs = ['bg2','bg3','bg4'];
	
	$scope.alertmeb = function() {
		if(!$rootScope.admin){
			$rootScope.slack($scope.u.displayName+" changed the bg ");
		}
	}
});