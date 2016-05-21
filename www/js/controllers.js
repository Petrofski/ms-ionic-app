angular.module('starter.controllers', [])

.controller('LoginCtrl', function($scope){

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
