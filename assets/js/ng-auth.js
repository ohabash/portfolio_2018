

app.controller('auth', function ($scope, $timeout, $location, $rootScope, Auth, $firebaseObject, $firebaseArray) {
  $rootScope.ACTIVE();

  $rootScope.notice("hand-spock-o","It's Safe!", "Knowing public user data allows this app to securely save your preferences.");
  $rootScope.inside=true;
  // $scope.get_active();

  
    






    $scope.addProfile = function(data) {
      $timeout(function() {
        console.log('making profile for '+data.displayName+"("+data.uid+")")
        $rootScope.profile['displayName'] = data.displayName;
        $rootScope.profile['email'] = data.email;
        $rootScope.profile['phoneNumber'] = data.phoneNumber;
        $rootScope.profile['photoURL'] = data.photoURL;
        $rootScope.profile['metadata'] = data.metadata;
        $rootScope.profile['uid'] = data.uid;
        $rootScope.profile['convo_id'] = "convos-"+data.uid;
        $rootScope.profile.$save().then(function () {
            // console.log('after save: ',$rootScope.profile);
        });
      }, 500);
    };



    $scope.signIn_g = function() {
      // login with google
      $scope.u = null;
      $scope.error = null;
  
      Auth.$signInWithPopup("google").then(function(firebaseUser) {
        $scope.after_auth(firebaseUser, 'Google');
      }).catch(function(error) {
        $scope.error = error;
        $rootScope.notice('exclamation-triangle',error.code,error.message);
      });
    };

    $scope.signIn_f = function() {
      // login with google
      $scope.u = null;
      $scope.error = null;
  
      Auth.$signInWithPopup("facebook").then(function(firebaseUser) {
        $scope.after_auth(firebaseUser, 'Facebook');
      }).catch(function(error) {
        $scope.error = error;
        $rootScope.notice('exclamation-triangle',error.code,error.message);
      });
    };

    $scope.signIn_git = function() {
      // login with google
      $scope.u = null;
      $scope.error = null;
  
      Auth.$signInWithPopup("github").then(function(firebaseUser) {
        $scope.after_auth(firebaseUser, 'GitHub');
      }).catch(function(error) {
        $scope.error = error;
        $rootScope.notice('exclamation-triangle',error.code,error.message);
      });
    };

    $scope.after_auth = function(firebaseUser, p) {
      if(!firebaseUser.user.email){
        $rootScope.notice('exclamation-triangle'+p+" did not send your email", 'Please update your email address with '+p+' before you can use this account.');
        console.error(p+" did not send email");
        Auth.$signOut();
        return false;
      }else if(!firebaseUser.user.displayName){
        $rootScope.notice('exclamation-triangle',p+" did not send your displayName", 'Please update your displayName address with '+p+' before you can use this account.');
        console.error(p+" did not send displayName");
        Auth.$signOut();
        return false;
      }
      console.log('firebaseUser:',firebaseUser.user)
        $location.path('/');
        // $rootScope.slack("NEW ACCOUNT: "+firebaseUser.user.displayName);
        $scope.addProfile(firebaseUser.user);
        if(firebaseUser.user.email == "contactomarnow@gmail.com") {
          $rootScope.admin = true;
        }
    }






});
























