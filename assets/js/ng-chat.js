

// ListenContrller
app.controller('chat', function ($scope, Auth, $timeout, $rootScope, $firebaseObject, $firebaseArray) {

    $rootScope.ACTIVE('chat');

	$('.main-right.contain-it').removeClass('contain-it').addClass('contain-it_chat');
	$('#talk1').addClass('contain-it pr');


	// got to bottom
    $rootScope.bottom = function() {
        $("#phone").animate({ scrollTop: $('#phone').prop("scrollHeight")}, 0);
    }

    // bottom on dom change
    $scope.$watch(function () {
       return document.body.innerHTML;
    }, function(val) {
       $rootScope.bottom();
    });

    // textarea ENTER
    $("textarea").keypress(function (e) {
        if(e.which == 13) {
        	$('.send-btn').click();
            e.preventDefault();
        }
    });

    // inform how to edit
    $timeout( function(){
        if($scope.u){
                $rootScope.notice("pencil-square-o","How to edit a message", "Just click on the blue text bubble to edit your message. ");
        }
    },20000);

    // zero out activity
    $timeout( function(){
        $scope.messages.$loaded( function(m){
            firebase.database().ref('profiles/'+$scope.u.uid+"/activity").transaction(current => {
                return (current || 0) - current;
            });
        });
    },1000);










    







});





app.controller('convos_nav', function ($scope, $routeParams, $route, $rootScope, $location, $timeout, $firebaseObject, $firebaseArray) {
	
});

















