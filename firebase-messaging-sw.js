importScripts('https://www.gstatic.com/firebasejs/4.6.2/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/4.6.2/firebase-messaging.js');

// importScripts('/__/firebase/init.js');

var config = {
    apiKey: "AIzaSyD0BOE888FHGoz04M_jFEyQYv6wAb9-1BM",
    authDomain: "portfolio-ca685.firebaseapp.com",
    databaseURL: "https://portfolio-ca685.firebaseio.com",
    projectId: "portfolio-ca685",
    storageBucket: "portfolio-ca685.appspot.com",
    messagingSenderId: "856164915936"
};
firebase.initializeApp(config);

const FCM = firebase.messaging();

// only runs if not on the page
FCM.setBackgroundMessageHandler( function(payload){
	return self.registration.showNotification();
});
