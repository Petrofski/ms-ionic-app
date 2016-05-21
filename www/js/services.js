angular.module('starter.services', [])

.factory('VasService', function($http, api) {
  // Might use a resource here that returns a JSON array



  return {
    postVasMessage: function(vasMessage) {
      console.log(vasMessage);
      $http.post( api + "/", vasMessage)
        .success(function(data, success){
          console.log("Successfully posted vasMessage");
        })
    }
  };
});
