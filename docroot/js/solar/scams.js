'use strict';

function SolarScamCtrl(GloriaAPI, $scope, $timeout) {

	$scope.scams = [ {}, {} ];
	$scope.status = {
		time : {
			count : Math.floor(Math.random() * 100000)
		}
	};

	$scope.status.time.onTimeout = function() {
		$scope.status.time.count += 1;
		var i = 0;
		$scope.scams.forEach(function(index) {
			$scope.scams[i].purl = $scope.scams[i].url + '?d='
					+ $scope.status.time.count;
			i++;
		});
		$scope.status.time.timer = $timeout($scope.status.time.onTimeout, 5000,
				1000);
	};

	$scope.$watch('rid', function() {
		if ($scope.rid > 0) {
			GloriaAPI.getParameterTreeValue($scope.rid, 'cameras', 'scam',
					function(data) {
						console.log(data);

						$scope.scams = data.images.slice(0, 2);
						$scope.status.time.timer = $timeout(
								$scope.status.time.onTimeout, 1000);
					}, function(error) {
						console.log(error);
					});
		}
	});

	$scope.$on('$destroy', function() {
		$timeout.cancel($scope.status.time.timer);
	});
}