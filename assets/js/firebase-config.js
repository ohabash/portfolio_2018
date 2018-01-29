
app.run(["$rootScope", "$location", function($rootScope, $location) {
	
	// init firebase with params
	var config = {
		apiKey: "AIzaSyD0BOE888FHGoz04M_jFEyQYv6wAb9-1BM",
		authDomain: "portfolio-ca685.firebaseapp.com",
		databaseURL: "https://portfolio-ca685.firebaseio.com",
		projectId: "portfolio-ca685",
		storageBucket: "portfolio-ca685.appspot.com",
		messagingSenderId: "856164915936"
	};
	firebase.initializeApp(config);
	

	// notifications
	const FCM = firebase.messaging();
	
	// called from ng-controller after firebase.auth().currentUser;
	$rootScope.initFCM = function (uid) {
		// console.log('store token');
		FCM.requestPermission().then( function(){
			$rootScope.notice("bell", "Subscription Success", "You will recieve push notifications related to your account activity.");
			return FCM.getToken();
		}).then( function(token){
			var updates = {};
			updates = {
				[token]: token
			};
			return firebase.database().ref('profiles').child(uid+'/fcm_token/').update(updates);
		}).catch( function(err){
			console.error('Permission Denied',err)
			$rootScope.notice("ban", err.code, "Enable notification for this site in your browser settings so you can be notified of account activity.");
		});
	};

	// handle incoming
	FCM.onMessage( function(payload){
		// console.log("$location.$$path", $location.$$path)
		if($location.$$path=="/chat"){
			console.log('no need to log activity');
		}else{
			console.log('new massage (FCM): ',payload);
			var note = payload.notification;
			$rootScope.notice("comments-o", note.title, note.body);
			var profileRef = firebase.database().ref('profiles/'+$rootScope.u.uid);
			profileRef.child('activity').transaction(current => {
				return (current || 0) + 1;
			});
		}
	});


}]);




/* 
=========== sample curl ===========

curl -X POST \
  https://fcm.googleapis.com/fcm/send \
  -H 'authorization: key=<settings/project settings/Server key>' \
  -H 'cache-control: no-cache' \
  -H 'content-type: application/json' \
  -H 'postman-token: 58d42c3f-c49e-abe1-5a08-b7a279780920' \
  -d '{"to":"<token>","priority":"high","notification":{"body": "<ur message>"}}'

===========
*/