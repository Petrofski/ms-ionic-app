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

.controller('DashCtrl', function($scope) {})

.controller('VasCtrl', function($scope, VasService, $cordovaGeolocation, $localStorage) {

  var posOptions = {timeout: 10000, enableHighAccuracy: false};

  $scope.postVas = function(score) {

    $cordovaGeolocation.getCurrentPosition(posOptions)
      .then(function (position) {
        var lat = position.coords.latitude
        var long = position.coords.longitude
        console.log(lat + ' ' + long )

        var vasMessage = {  pain: score,
                            datetime: function(){ return Math.floor(Date.now() / 1000 )},
                            id: $localStorage.id
        }

        VasService.postVasMessage(vasMessage);

      })
  }

})


.controller('AccountCtrl', function($scope) {

});
