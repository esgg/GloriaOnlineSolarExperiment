'use strict';

function SolarMainCtrl(GloriaAPI, $scope) {

	$scope.arrowsEnabled = false;
	$scope.weatherLoaded = false;
	$scope.ccdImagesLoaded = false;
	$scope.elapsedTimeLoaded = false;
	$scope.targetSettingsLoaded = false;
	$scope.movementDirection = null;
	$scope.imageTaken = true;
	
	$scope.$watch('password', function () {

		GloriaAPI.setCredentials($scope.user, $scope.password);
		
		GloriaAPI.getActiveReservations(function(data) {
			data.forEach(function(element) {
				if ($scope.rid == undefined && element.experiment == "SOLAR"
						&& element.status == "READY") {
					$scope.rid = element.reservationId;
					$scope.reservationActive = true;
				}
			});
			if ($scope.rid == undefined) {
				$scope.rid = -1;
				$scope.reservationActive = false;
			}
		}, function(error) {
			$scope.rid = -1;
			$scope.reservationActive = false;
		});
	});
}