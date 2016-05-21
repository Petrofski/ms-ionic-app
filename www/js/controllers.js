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
			TokenService.set('user-id', response.data.userId)
			LoginService.me().then(function successCallback(response) {
				$state.go('tab.dash');
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

.controller('VasCtrl', function($scope, VasService, TokenService) {

  var posOptions = {timeout: 10000, enableHighAccuracy: false};

  $scope.postVas = function(score) {

      navigator.geolocation.getCurrentPosition(
          function(position) {
            console.log("Position: ", position)

            var vasMessage = {  vasScore: score,
                                datetime: position.timestamp,
                                geopoint: {
                                    lat: position.coords.latitude,
                                    lng: position.coords.longitude
                                }
            }
            console.log(vasMessage);
            VasService.postVasMessage(vasMessage);

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
