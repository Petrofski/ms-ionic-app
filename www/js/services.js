angular.module('starter.services', [])

.factory('VasService', function($http, api, TokenService) {
  // Might use a resource here that returns a JSON array
  return {
    postVasMessage: function(vasMessage) {
      var id = TokenService.get('user-id');
      var token = TokenService.get('user-token');
      var route = api + "Patients/" + id + "/mobileData?access_token=" + token;
      console.log(route);
      return $http.post( route , vasMessage)
        .success(function(data, success){
          console.log(data);
          console.log("Successfully posted vasMessage");
        })
    }
  };
})

.factory('DataService', function($http, TokenService, api) {
  var id = TokenService.get('user-id');
  var token = TokenService.get('user-token');
  var route = "http://sensing-ms-api.mybluemix.net/api/Patients/" + id + "/sensorData?filter[order]=datetime%20DESC&filter[limit]=5&access_token=" + token;

  return {
    getDashboardData: function(){
      return $http.get(route).success(function(res, data){ console.log('Response: ', data)});
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
    set: function(key, value) { $window.localStorage[key] = value; },
    remove: function(key) { $window.localStorage.removeItem(key); }
  };
})

.factory('MedicationService', function($http, api, TokenService) {
    var medication = [];
            var r1 = { name: "Betaferon", dose: "1 injection / month" }
            var r2 = { name: "Copaxone", dose: "3 injections / year" }
            medication.push(r1, r2);
    var id = TokenService.get('user-id');
    var token = TokenService.get('user-token');
    var route = api + "Patients/" + id + "/drugs?access_token=" + token;
    return {
        get: function() {
            return medication;
        },
        add: function(med) {
            medication.push(med);
        },
        post: function(med) {
            return $http.post(route, med)
            .success(function(response, data) {
              medication.push(med)
            }).error(function(response, error) {
              console.log('something went wrong: ', error);
            });
        }
    }
})

.factory('RmiService', function() {
    var rmi = [];
            var dat = new Date();
            dat.setDate(25);
            dat.setMonth(2);
            dat.setYear(2015);
            //dat.setYear();
            var dat2 = new Date();
            dat2.setMonth(5)
            var r1 = { info: "Info 1", date: dat }
            var r2 = { info: "Info 2", date: dat2 }
            rmi.push(r1, r2);
    return {
        get: function() {
            return rmi;
        },
        add: function(r) {
            rmi.push(r);
        }
    }
})




