angular.module('starter.controllers', [])

.controller('LoginCtrl', function($scope, $state, LoginService, TokenService){
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

.controller('DashCtrl', function($scope) {})

.controller('VasCtrl', function($scope, VasService, TokenService, $state) {

  var posOptions = {timeout: 10000, enableHighAccuracy: false};

  var lastVasDate = TokenService.get('lastVasDate');
  $scope.lastVasDate = Number(lastVasDate);
  var lastVasScore = TokenService.get('lastVasScore');
  $scope.lastVasScore = lastVasScore;

  var countdown = Math.floor(Date.now() / 1000 ) - 15;
  console.log(Number(lastVasDate) - countdown);
  console.log(countdown);

  $scope.countdown = countdown;

  $scope.lastVasExpired = function(){
    if(lastVasDate == undefined) {
      return false;
    } else if ( Number(lastVasDate) > countdown ) {
      return true;
    } else {
      return false;
    }
  }

  $scope.lastVasExists = function(){ if(lastVasDate != undefined) return true;}

  $scope.postVas = function(score) {
      $scope.lastVasExpired = function(){return true};
      navigator.geolocation.getCurrentPosition(
          function(position) {
            console.log("Position: ", position)


            var vasMessage = {  vasScore: score,
                                datetime: Math.floor(position.timestamp / 1000),
                                geopoint: {
                                    lat: position.coords.latitude,
                                    lng: position.coords.longitude
                                }
            }

            TokenService.set('lastVasDate', vasMessage.datetime);
            TokenService.set('lastVasScore', vasMessage.vasScore);

            VasService.postVasMessage(vasMessage).then(function(){
              $scope.lastVasExists = true;
              $scope.lastVas = vasMessage;
            });

          },
          function(error) {console.log("error location")},
          {enableHighAccuracy: false})

  }

})


.controller('AccountCtrl', function($scope) {

});
