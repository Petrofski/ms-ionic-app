angular.module('starter.services', [])

.factory('VasService', function($http, api, TokenService) {
  // Might use a resource here that returns a JSON array



  return {
    postVasMessage: function(vasMessage) {
      console.log(vasMessage);
      return $http.post( api + "/Patients/" + TokenService.get('user-id') + "/mobileData?access_token=" + TokenService.get('user-token') , vasMessage)
        .success(function(data, success){
          console.log(data);
          console.log("Successfully posted vasMessage");
        })
    }
  };
})


.factory('LoginService', function($http, TokenService) {
  return {
    login: function(user) {
      // API CALL
      return $http.post('http://sensing-ms-api.mybluemix.net/api/' + 'Patients/login', user)
        .success(function(response, data) {
          console.log('Response: ', data);
        }).error(function(response, error) {
          console.log('Error: ', error);
          console.log(response);
        });
    },
    me: function() {
      var id = TokenService.get('user-id');
      var token = TokenService.get('user-token');
      return $http.get('http://sensing-ms-api.mybluemix.net/api/Patients/' + id + '?access_token=' + token)
        .success(function(response, data) {
          console.log('Response: ', data);
        }).error(function(response, error) {
          console.log('Error: ', error);
          console.log(response);
        });
    }
  };
})

.factory('TokenService', function($window) {
  return {
    get: function(key) { return $window.localStorage[key]; },
    set: function(key, value) { $window.localStorage[key] = value; }
  };
});
