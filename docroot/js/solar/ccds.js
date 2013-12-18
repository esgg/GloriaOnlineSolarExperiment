'use strict';

function LoadCCDContent(GloriaAPI, scope) {
	return scope.sequence.execute(function() {
		return GloriaAPI.getParameterTreeValue(scope.rid, 'cameras', 'ccd',
				function(data) {
					console.log(data);
					scope.ccds = data.images.slice(0, 2);
				});
	});
}

function LoadContinuousImage(GloriaAPI, scope, order) {

	scope.sequence.execute(function() {
		return GloriaAPI.setParameterTreeValue(scope.rid, 'cameras',
				'ccd.order', order, function() {
					scope.ccdSelected = order;
				});
	});

	scope.sequence.execute(function() {
		return GloriaAPI.executeOperation(scope.rid, 'stop_continuous_image',
				function() {
					scope.continuousMode = false;
				});
	});

	return scope.sequence.execute(function() {
		return GloriaAPI.executeOperation(scope.rid, 'load_continuous_image',
				function() {
					scope.continuousMode = true;
				});
	});
}

function SetExposureTime(GloriaAPI, scope) {

	scope.status.main.exposure.valueSet = false;

	if (scope.ccdSelected != 0) {
		scope.sequence.execute(function() {
			return GloriaAPI.setParameterTreeValue(scope.rid, 'cameras',
					'ccd.order', 0, function() {
						scope.ccdSelected = 0;
					});
		});
	}

	scope.sequence.execute(function() {
		return GloriaAPI.setParameterTreeValue(scope.rid, 'cameras',
				'ccd.images.[0].exposure', scope.ccds[0].exposure, function(
						data) {
					// PUT SOMETHING HERE!!
				});
	});

	return scope.sequence.execute(function() {
		return GloriaAPI.executeOperation(scope.rid, 'set_exposure', function(
				data) {
			scope.status.main.exposure.valueSet = true;
		});
	});
}

function LoadCCDAttributes(GloriaAPI, scope, order) {

	scope.sequence.execute(function() {
		return GloriaAPI.setParameterTreeValue(scope.rid, 'cameras',
				'ccd.order', order, function() {
					scope.ccdSelected = order;
				});
	});

	return scope.sequence.execute(function() {
		return GloriaAPI.executeOperation(scope.rid, 'get_ccd_attributes',
				function(data) {
					// PUT SOMETHING HERE!!
				});
	});
}

function CheckExposure(GloriaAPI, scope, timeout) {
	scope.status.main.exposure.timer = timeout(
			scope.status.main.exposure.check, 1000);
}

function StartExposure(GloriaAPI, scope, timeout) {

	scope.$parent.imageTaken = false;
	scope.sequence.execute(function() {
		return GloriaAPI.setParameterTreeValue(scope.rid, 'cameras',
				'ccd.order', 0, function() {
					scope.ccdSelected = 0;
				});
	});

	return scope.sequence.execute(function() {
		return GloriaAPI.executeOperation(scope.rid, 'start_exposure',
				function(data) {
					CheckExposure(GloriaAPI, scope, timeout);
				});
	});
}

function SolarCCDCtrl(GloriaAPI, $scope, $timeout, $sequenceFactory) {

	$scope.sequence = $sequenceFactory.getSequence();
	$scope.finderImage = 'img/wn3.gif';
	$scope.ccds = [ {}, {} ];
	$scope.status = {
		time : {
			count : Math.floor(Math.random() * 100000)
		},
		finder : {
			focused : false
		},
		main : {
			focused : false,
			clock : {
				focused : false
			},
			camera : {
				focused : false
			},
			exposure : {
				begin : null,
				end : null,
				length : 0,
				valueSet : true
			}
		}
	};

	$scope.exposureStyle = {};
	$scope.exposureBarStyle = {};

	$scope.moveFinder = function(direction) {
		$scope.$parent.movementDirection = direction;
		$scope.$parent.movementRequested = true;
	};

	$scope.beginSetExposureTime = function() {
		$scope.status.main.exposure.begin = new Date();
	};

	$scope.endSetExposureTime = function() {
		$scope.status.main.exposure.end = new Date();
		$scope.status.main.exposure.length = ($scope.status.main.exposure.end - $scope.status.main.exposure.begin) / 1000;
		$scope.status.main.exposure.length = Math.min(2.0, Math.max(
				$scope.status.main.exposure.length, 0));
	};

	$scope.status.main.exposure.check = function() {
		$scope.sequence.execute(function() {
			return GloriaAPI.getParameterTreeValue($scope.rid, 'cameras',
					'ccd.images.[0].inst', function(data) {
						if (data.id >= 0) {
							if (data.jpg != undefined && data.jpg != null) {
								$scope.$parent.imageTaken = true;
							} else {
								$scope.sequence.execute(function() {
									return GloriaAPI.executeOperation(
											$scope.rid, 'load_image_urls',
											function() {
												CheckExposure(GloriaAPI,
														$scope, $timeout);
											});
								});
							}
						} else {
							alert("exposure failed");
							$scope.$parent.imageTaken = true;
						}
					});
		});
	};

	$scope.setExposureTimeValue = function(sign) {
		$scope.ccds[0].exposure += (0.01 * $scope.status.main.exposure.length)
				* sign;
		console.log($scope.ccds[0].exposure);

		if ($scope.ccds[0].exposure < 0) {
			$scope.ccds[0].exposure = 0;
		} else if ($scope.ccds[0].exposure > 0.05) {
			$scope.ccds[0].exposure = 0.05;
		}

		$scope.exposureStyle.top = ((($scope.ccds[0].exposure * 230 / 0.05) + 83) * -1.0)
				+ "px";
		$scope.exposureBarStyle.top = 230
				- ((($scope.ccds[0].exposure * 230 / 0.05))) + "px";
	};

	$scope.setExposureTime = function() {
		SetExposureTime(GloriaAPI, $scope);
	};

	$scope.startExposure = function() {
		StartExposure(GloriaAPI, $scope, $timeout);
	};

	$scope
			.$watch(
					'weatherLoaded',
					function() {
						if ($scope.rid > 0) {

							LoadCCDAttributes(GloriaAPI, $scope, 0);
							LoadCCDContent(GloriaAPI, $scope)
									.then(
											function() {

												var upToDate = true;

												for ( var i = 0; i < $scope.ccds.length; i++) {
													if ($scope.ccds[i].cont == undefined
															|| $scope.ccds[i].cont == null) {
														LoadContinuousImage(
																GloriaAPI,
																$scope, i);
														upToDate = false;
													}
												}

												if (!upToDate) {
													LoadCCDContent(GloriaAPI,
															$scope)
															.then(
																	function() {
																		console
																				.log('initial context loaded');
																		$scope.$parent.ccdImagesLoaded = true;

																	});
												} else {
													console
															.log('initial context loaded');
													$scope.$parent.ccdImagesLoaded = true;
												}

												$scope.exposureStyle.top = ((($scope.ccds[0].exposure * 260 / 0.05) + 69) * -1.0)
														+ "px";
												$scope.exposureBarStyle.top = 260
														- ((($scope.ccds[0].exposure * 260 / 0.05)))
														+ "px";

												$scope.status.time.timer = $timeout(
														$scope.status.time.onTimeout,
														1000, 1000);

											});
						}
					});

	$scope.status.time.onTimeout = function() {
		$scope.status.time.count += 1;
		var i = 0;
		$scope.ccds
				.forEach(function(index) {
					// $scope.ccds[i].pcont = null; // DELETE THIS!
					if ($scope.ccds[i].cont != null
							&& $scope.ccds[i].cont != undefined) {
						$scope.ccds[i].pcont = $scope.ccds[i].cont + '?d='
								+ $scope.status.time.count;
					}

					i++;
				});
		$scope.status.time.timer = $timeout($scope.status.time.onTimeout, 1000,
				1000);
	};

	$scope.$on('$destroy', function() {
		$timeout.cancel($scope.status.time.timer);
		$timeout.cancel($scope.status.main.exposure.timer);
	});
}
