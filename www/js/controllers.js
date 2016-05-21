angular.module('starter.controllers', [])

.controller('LoginCtrl', function($scope, $state, LoginService, TokenService){

	var token = TokenService.get('user-token');
	if(token && token.length > 0) {
		$state.go('tab.vas');
	}

	$scope.login = function(credentials) {
		var user = {
			"username": credentials.username,
			"password": credentials.password
		}
		LoginService.login(user).then(function successCallback(response) {
			//console.log(response);
			TokenService.set('user-token', response.data.id);
			TokenService.set('user-id', response.data.userId);
			LoginService.me().then(function successCallback(response) {
				$state.go('tab.vas');
			}, function errorCallback(response) {
				console.log("error", response);
			})
		}, function errorCallback(response) {
			console.log('error');
		});
	}
})

.controller('DashCtrl', function($scope) {

})

.controller('VasCtrl', function($scope, VasService, TokenService, $state, $timeout) {

  var posOptions = {timeout: 10000, enableHighAccuracy: false};
  var DISABLE_TIMER = 10;

  $scope.$on('$ionicView.enter', function () {
    console.log("Checking VAS vars ");
    var lastVasDate = TokenService.get('lastVasDate');
    $scope.lastVasDate = Number(lastVasDate);
    var lastVasScore = TokenService.get('lastVasScore');
    $scope.lastVasScore = lastVasScore;

    var countdown = Math.floor(Date.now() / 1000 ) - DISABLE_TIMER;
    $scope.countdown = countdown;

    if(lastVasDate == undefined) {
      $scope.lastVasExpired = false;
    } else if ( Number(lastVasDate) > countdown ) {
      $scope.lastVasExpired = true;
    } else {
      $scope.lastVasExpired = false;
    }

    $scope.lastVasExists = function(){ if(lastVasDate != undefined) return true;}
  });


  $scope.postVas = function(score) {
      $scope.lastVasExpired = function(){return true};
      navigator.geolocation.getCurrentPosition(
          function(position) {

            var vasMessage = {  vasScore: score,
                                datetime: Math.floor(position.timestamp / 1000),
                                geopoint: {
                                    lat: position.coords.latitude,
                                    lng: position.coords.longitude
                                }
            }

            TokenService.set('lastVasDate', vasMessage.datetime);
            TokenService.set('lastVasScore', vasMessage.vasScore);

            VasService.postVasMessage(vasMessage).then(function successCallback(){
              $scope.lastVasExists = true;
              $scope.lastVasScore = vasMessage.vasScore;
              $scope.lastVasDate = vasMessage.datetime;
              $timeout(function(){ $scope.lastVasExpired = false}, DISABLE_TIMER * 1000);
            }, function errorCallback(){
              console.log("Errororororoeoeroro")
            });

          },
          function(error) {console.log("error location")},
          {enableHighAccuracy: false})

  }

})


.controller('AccountCtrl', function($scope, $state, TokenService) {
	$scope.logout = function() {
		TokenService.remove('user-id');
		TokenService.remove('user-token');
		$state.go('login');
	}
});
