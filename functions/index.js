'use strict';

const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

/*
 * Triggers when a user gets a new message and sends a notification.
*/
exports.newMSG = functions.database.ref('profiles/{uID}/chats/archive/{msgID}').onWrite(event => {
	const uID = event.params.uID;
	const msgID = event.params.msgID;
	const msg = event.data._delta;
	const uid_to = msg.uid_to;
	const authUid = event.auth.variable.user_id;
	const profileRef = admin.database().ref(`/profiles/${uid_to}`);
	// console.log('event',event)

	//get FCM Token with uid_to
	const getFcmTokenPromise = profileRef.child('fcm_token').once('value');
	
	// once fetches complete
	return Promise.all([getFcmTokenPromise]).then(results => {

		const FcmTokens = results[0];

    	// Check if there are any device tokens.
	    if (!FcmTokens.hasChildren()) {
	    	return console.log(FcmTokens,'There are no notification tokens to send to.');
	    }
	    console.log('There are', FcmTokens.numChildren(), 'tokens to send notifications to.');

	    // Notification details.
	    const payload = {
			data: {
				title: `New message: ${msg.display}`,
				body: `${msg.text}`,
				icon: 'https://vignette.wikia.nocookie.net/transformers-legends/images/0/0a/Logo-icon.png/revision/latest?cb=20131111205325'
			}
	    };

	    // Listing all tokens.
		const tokens = Object.keys(FcmTokens.val());

		// Send notifications to all tokens.
	    return admin.messaging().sendToDevice(tokens, payload).then(response => {
	      // For each message check if there was an error.
	      const tokensToRemove = [];

	      // activity++ (going to do it .onMessage() instead)
	      // profileRef.child('activity').transaction(current => {return (current || 0) + 1; });

	      response.results.forEach((result, index) => {
	        const error = result.error;
	        if (error) {
	          console.error('Failure sending notification to', tokens[index], error);
	          // Cleanup the tokens who are not registered anymore.
	          if (error.code === 'messaging/invalid-registration-token' ||
	              error.code === 'messaging/registration-token-not-registered') {
	              	tokensToRemove.push(tokensSnapshot.ref.child(tokens[index]).remove());
		          }
	        }else{
	        }
	      });
	      
	      return Promise.all(tokensToRemove);
	    });



	});

});