angular.module('starter.services', [])

.factory('VasService', function($http, api, TokenService) {
  // Might use a resource here that returns a JSON array



  return {
    postVasMessage: function(vasMessage) {
      console.log(vasMessage);
      $http.post( api + "Patients/" + TokenService.get('user-id') + "/mobileData?access_token=" + TokenService.get('user-token') , vasMessage)
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
    set: function(key, value) { $window.localStorage[key] = value; },
    remove: function(key) { $window.localStorage.removeItem(key); }
  };
})

.factory('MedicationService', function() {
    var medication = [];
            var dat = new Date();
            dat.setDate(25);
            dat.setMonth(2);
            dat.setYear(2015);
            //dat.setYear();
            var dat2 = new Date();
            dat2.setMonth(5)
            var r1 = { name: "Medication 1", date: dat }
            var r2 = { name: "Medication 2", date: dat2 }
            medication.push(r1, r2);
    return {
        get: function() {
            return medication;
        },
        add: function(med) {
            medication.push(med);
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
