// console.log('ng-controller');
require('./ng-notice.js');


// ListenContrller
app.controller('main', function ($scope, $http, Auth,  $timeout, $route, $rootScope, $location, editableOptions, $firebaseObject, $firebaseArray) {


	  angular.element(window).bind('resize', function () {
	  	// console.log($(this).width())
	  });

	// backgrounds
	$scope.$bg = 'bg3';
	$scope.bg = function(bg) {
		$scope.$bg = bg;
	};
	
	$scope.edit_off = function(bool) {
		// console.log('bool')
		editableOptions.isDisabled=bool;
		if(bool){
			$('[editable-text]').re
		}
	}

	// slack
	$rootScope.slack = function (text) {
		return $http.post("https://hooks.slack.com/services/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",
		{
			text: text,
			'username': "test"
		})
		.then(function (response) {
			console.log(response)
			return response;
		});
	};
	

	// auth status
	$rootScope.admin = false;
	Auth.$onAuthStateChanged(function(firebaseUser) {
		$scope.u = firebase.auth().currentUser;
		$rootScope.u = firebase.auth().currentUser;
		console.log('current user: ',$scope.u);
		if (firebaseUser) {
			// $location.path('/');
			$scope.getProfiles(firebaseUser);
			// $rootScope.notice("Welcome "+$scope.u.email+"! ", "green-bg white");
			$rootScope.notice("magic", "welcome "+$scope.u.displayName, 'Take a look around.');

			if ($scope.u.email == "contactomarnow@gmail.com") {
				$rootScope.notice("magic","You are an admin", "You will notice extra tools.");
				$rootScope.admin = true;
				$scope.edit_off(false);
			}else{
				$rootScope.slack($scope.u.displayName+' logged in at OH.com.');
			}
		} else {}
	});


	//profiles
	$rootScope.getProfiles = function(data) {
		// all profiles
		var ref = firebase.database().ref().child('profiles');
		$rootScope.profiles = $firebaseArray(ref);
		
		// single profile
		var ref = firebase.database().ref().child('profiles/'+data.uid);
		$rootScope.profile = $firebaseObject(ref);
	};






	// fullscreen
    $scope.fullscreen = function() {
    	$rootScope.slack($scope.u.displayName+": toggled fullscreen");
    	var icon = $('.Fullscreen');
    	    var isInFullScreen = (document.fullscreenElement && document.fullscreenElement !== null) ||
        (document.webkitFullscreenElement && document.webkitFullscreenElement !== null) ||
        (document.mozFullScreenElement && document.mozFullScreenElement !== null) ||
        (document.msFullscreenElement && document.msFullscreenElement !== null);

    var docElm = document.documentElement;
    if (!isInFullScreen) {
    	icon.addClass('green');
        if (docElm.requestFullscreen) {
            docElm.requestFullscreen();
        } else if (docElm.mozRequestFullScreen) {
            docElm.mozRequestFullScreen();
        } else if (docElm.webkitRequestFullScreen) {
            docElm.webkitRequestFullScreen();
        } else if (docElm.msRequestFullscreen) {
            docElm.msRequestFullscreen();
        }
    } else {
    	icon.removeClass('green');
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
    }
	}
	// launchIntoFullscreen(document.documentElement);
	// launchIntoFullscreen(document.getElementById("document"));

	// edit scripts
	$rootScope.changes = false;
    $scope.trigger_changes = function(s) {
    	// console.log('trigger_changes()')
    	$rootScope.changes = s;
    };


	// logOut
    $scope.logout = function() {
      Auth.$signOut();
      // console.log("logout()");
      $rootScope.admin = false;
      $rootScope.notice('hand-peace-o', "Goodbye "+$scope.u.displayName, "Your session is no-more", 'dark');
      $location.path('/');
    };

    // logOut
    $scope.log = function(x) {
      console.log(x);
    };
    

	//======== various functions below ========//
	// set mobile states
	$scope.isMobile = function(x) {
		return (isMobile()) ? true : false;
	}
	if($scope.isMobile()){
		// console.log($scope.isMobile());
		$location.path('/mobile');
	}

	// on route change
	$scope.$on('$routeChangeStart', function(next, current) { 
		if(!$scope.admin){
			$scope.edit_off(true);
		}
		$('.main-right.contain-it_chat').removeClass('contain-it_chat').addClass('contain-it');
		$timeout( function(){
			($scope.messages) ? $scope.countUnviewed() : console.log('no need to count');
		},2000);
	});
	$timeout( function(){
		($scope.messages) ? $scope.watch() : console.error('watch');
	},2200);








    var chat = {
		make_convo_id: function (ids) {
			var sorted = ids.sort(function (a, b) {
				return a.toLowerCase().localeCompare(b.toLowerCase());
			});
			return sorted[0]+'_'+sorted[1]
		},
		get_convo: function (convo_id){
			var ref = firebase.database().ref('/chats/').child(convo_id);
			$scope.this_convo_obj = $firebaseObject(ref);
	    	return $firebaseArray(ref);
		},
		get_msgs: function (convo_id){
			var ref = firebase.database().ref('/chats/').child(convo_id+"/archive");
			$scope.convo_obj = $firebaseObject(ref);
	    	return $firebaseArray(ref);
		},
		new_msg: function (t){
			var data = {
				text: t,
				// read[$rootScope.profile.uid]: true,
				display: $rootScope.u.displayName,
				email: $rootScope.u.email,
				read: false,
				time: new Date().valueOf(),
				uid: $rootScope.u.uid
			}
			data['read_'+$rootScope.profile.uid] = true;
			data['read_'+$scope.him.uid] = false;
			$scope.messages.$add(data);
			$('#msgInput').val('');
		},
		set_busy: function (me,him,convo){
			var set_ref = firebase.database().ref('/chats/'+convo).child("busy");
			$scope.busy_obj = $firebaseObject(set_ref);
			$scope.busy_arr = $firebaseArray(set_ref);
			$scope.busy_obj[me] = false;
			$scope.busy_obj[him] = false;
			$scope.busy_obj.$save();
		},
		profiles: function (){
			var ref = firebase.database().ref().child('profiles');
			return $firebaseArray(ref);
		},
		typing: function (me){
			if(!$scope.busy_obj[me]){
				$scope.busy_obj[me] = true;
				$scope.busy_obj.$save();
				$timeout(function() {
					$scope.busy_obj[me] = false;
					$scope.busy_obj.$save();
				}, 3000);
			}
		}
	} 

	$rootScope.get_profiles = function() {
		$rootScope.profiless=chat.profiles();
	}

	$scope.last ={};
	// $scope.unRead ={};
	$rootScope.switch_convo = function(talking_to, init) {
		console.log('switch_convo');
		$scope.him = talking_to;
		if($rootScope.admin){
			var convo = $scope.him.displayName;
		}else{
			var convo = $rootScope.u.displayName;
		}
		// $scope.convo_id = chat.make_convo_id([talking_to.uid, $rootScope.profile.uid]);
		$scope.convo_id = 'convo_'+convertToSlug(convo);
		$scope.convo = chat.get_convo($scope.convo_id);
		$scope.messages = chat.get_msgs($scope.convo_id);
		$scope.busy = chat.set_busy(talking_to.uid, $rootScope.profile.uid,$scope.convo_id);
		$scope.messages.$loaded( function(m){
			var len = m.length-1;
			$scope.last[talking_to.uid] = m[len];
		});
		$timeout(function(){
			// $scope.watch();
		},2000);
	};


	$scope.addMessage = function(t) {
		// console.log('him: ',$scope.him)
		if($scope.him.email=='contactomarnow@gmail.com'){
			$rootScope.slack($scope.u.displayName+": "+t);
		}
		var x = chat.new_msg(t);
	}

	$scope.typing = function() {
		chat.typing($rootScope.profile.uid);
	}



	$scope.watch = function(e) {
		console.log('watch');
	 	$scope.convo_obj.$watch(function(a) {
 			$scope.countUnviewed();
	    });
	}

	$scope.countUnviewed = function() {
		console.log('countUnviewed');
	  $timeout(function() {
	  	$scope.unRead = 0;
	    $.each($scope.messages, function(){
	      if(!this['read_'+$rootScope.profile.uid]){
	        $scope.unRead++;
	      }
	    });
		if($scope.unRead){$scope.alertLatest()};
      	changeTitle($scope.unRead);
	  }, 1000);
	};

	$scope.alertLatest = function() {
	  var msg_count = $scope.messages.length;
	  var last = $scope.messages[msg_count-1];
	  // console.log("last",last)
	  $rootScope.notice("comments",'New message: '+last.display, last.text);
	};

	// page title
	function changeTitle(count) {
	  if(count<1){
	    document.title = "Omar Habash";
	  }else{
	    var newTitle = '(' + count + ') ' + "Omar Habash";
	    document.title = newTitle;
	  }
	}




	







});












// check if is mobile
function isMobile() {
	var check = false;
	(function(a){if(/(android|ipad1|playbook|silk|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true})(navigator.userAgent||navigator.vendor||window.opera);
	return check;
}

// controllers
window.convertToSlug = function(Text) {
    return Text
        .toLowerCase()
        .replace(/ /g,'-')
        .replace(/[^\w-]+/g,'')
        ;
}





require('./ng-home.js');
// require('./ng-carousel.js');
require('./ng-menu.js');
require('./ng-mission.js');
require('./ng-downloads.js');
require('./ng-mobile.js');
require('./ng-settings.js');
require('./ng-nav.js');
require('./ng-home-m');
require('./ng-projects.js');
require('./ng-auth.js');
require('./ng-account.js');
require('./ng-chat.js');
require('./ng-skills.js');
require('./ng-faq.js');
require('./ng-gallery.js');



