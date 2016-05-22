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

.controller('DashCtrl', function($scope, DataService) {
    $scope.graph = {};
    $scope.$on('$ionicView.enter', function () {
      DataService.getDashboardData().then(function successCallback(data){
        $scope.data = data.data;
        var activityPoint = data.data.map(function(item){
          return item.activity.score;
        }).reverse();
        $scope.graph.data = [activityPoint];
      }, function errorCallback(err){
        console.log(err)
      })
    })

    $scope.graph.labels = ['t-4', 't-3', 't-2', 't-1', 't'];

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

    $scope.lastVasExpired = function(){ if(lastVasDate != undefined) return true;}
  });


  $scope.postVas = function(score) {
      $scope.lastVasExpired = true;
      navigator.geolocation.getCurrentPosition(
          function(position) {

            var vasMessage = {  vasScore: score,
                                datetime: Date.now(),
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


.controller('AccountCtrl', function($scope, $state, $ionicModal, $ionicPopup, $ionicLoading, TokenService, MedicationService, RmiService) {
	$scope.logout = function() {
		TokenService.remove('user-id');
		TokenService.remove('user-token');
		$state.go('login');
	}

	$scope.modals = {};

	$ionicModal.fromTemplateUrl('templates/medication.html', {
	    id: 'medication',
	    scope: $scope,
	    animation: 'slide-in-up'
	}).then(function(modal) {
		$scope.modals.medication = modal;
	});

	$ionicModal.fromTemplateUrl('templates/rmi.html', {
	    id: 'rmi',
	    scope: $scope,
	    animation: 'slide-in-up'
	}).then(function(modal) {
		$scope.modals.rmi = modal;
	});

	$scope.openMedication = function() {
		$scope.modals['medication'].show();
	}

	$scope.closeMedication = function(id) {
		$scope.modals['medication'].hide();
	};

	$scope.openRmi = function() {
		$scope.modals['rmi'].show();
	}

	$scope.closeRmi = function() {
		$scope.modals['rmi'].hide();
	}

	$scope.medication = MedicationService.get();

	$scope.showLoader = function() {
	    $ionicLoading.show({
	      template: 'Adding medication',
	      duration: 1000
	    }).then(function(){
	       console.log("The loading indicator is now displayed");
	    });
	};
	$scope.hideLoader = function(){
	    $ionicLoading.hide().then(function(){
	       console.log("The loading indicator is now hidden");
	    });
	};

	$scope.addMedication = function() {
		
		$scope.new = { };

		var medicationPopup = $ionicPopup.show({
		    template: '<input type="text" placeholder="Name" ng-model="new.name" style="margin-bottom: 5px;"><input type="text" placeholder="Dose" ng-model="new.dose"></input>',
		    title: 'Enter new medication',
		    subTitle: 'Enter name and dose',
		    scope: $scope,
		    buttons: [
		      { text: 'Cancel',
		      	onTap: function(e) {
		      		$scope.new = {}
		      	}
		      },
		      {
		        text: '<b>Save</b>',
		        type: 'button-positive',
		        onTap: function(e) {
		        	$scope.showLoader();
		        	if (!$scope.new.name) {
		            	//don't allow the user to close unless he enters wifi password
		            	e.preventDefault();
		        	} else {
		          		if(!$scope.new.dose) {
		          			$scope.new.dose = "N/A";
		          		}
		          		console.log($scope.new);
		            	MedicationService.post($scope.new).then(function success() {
		            	});
		          	}
		          	$scope.hideLoader();
		        }
		      }
		    ]
		});
	}

	$scope.rmi = RmiService.get();

	$scope.addRmi = function() {
		
		$scope.new = { date: new Date(Date.now()) };

		var rmiPopup = $ionicPopup.show({
		    template: '<input type="text" placeholder="info" ng-model="new.info" style="margin-bottom: 5px;"><input type="date" placeholder="date" ng-model="new.date"></input>',
		    title: 'Enter new Rmi',
		    subTitle: 'Enter date and info',
		    scope: $scope,
		    buttons: [
		      { text: 'Cancel',
		      	onTap: function(e) {
		      		$scope.new = {}
		      	}
		      },
		      {
		        text: '<b>Save</b>',
		        type: 'button-positive',
		        onTap: function(e) {
		          if (!$scope.new.date) {
		            //don't allow the user to close unless he enters wifi password
		            e.preventDefault();
		          } else {
		          	if(!$scope.new.info) {
		          		$scope.new.info = "";
		          	}
		          	console.log($scope.new);
		            RmiService.add($scope.new);
		          }
		        }
		      }
		    ]
		});
	}

});








