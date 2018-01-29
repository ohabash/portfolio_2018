app.controller('nav', function ($scope, $timeout, $route, $rootScope, $location) {
	

	// teams list
	$scope.teams = [
		{
		    icon: "magic",
		    name: "skills",
		    path: "skills",
		    badge: ""
		},
		{
		    icon: "desktop",
		    name: "projects",
		    path: "",
		    badge: ""
		},
		{
		    icon: "comments-o",
		    name: "chat",
		    path: "chat",
		    badge: $rootScope.unRead
		}
	];

    // needed to set active0
    $rootScope.ACTIVE = function (pth) {
		$('.nav-link').removeClass('active0');
		$('.nav-link.'+pth).addClass('active0');
    };

    

});

