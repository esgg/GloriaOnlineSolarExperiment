<%
/**
 * Copyright (c) 2000-2011 Liferay, Inc. All rights reserved.
 *
 * This library is free software; you can redistribute it and/or modify it under
 * the terms of the GNU Lesser General Public License as published by the Free
 * Software Foundation; either version 2.1 of the License, or (at your option)
 * any later version.
 *
 * This library is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU Lesser General Public License for more
 * details.
 */
%>

<%@ taglib uri="http://java.sun.com/portlet_2_0" prefix="portlet" %>

<portlet:defineObjects />

<%@ page import="com.liferay.portal.theme.ThemeDisplay"%>
<%@ page import="com.liferay.portal.kernel.util.WebKeys"%>
<%@ page import="com.liferay.portal.model.User"%>

<script src="http://cdn.alloyui.com/2.0.0/aui/aui-min.js"></script>

<link href="http://cdn.alloyui.com/2.0.0/aui-css/css/bootstrap.min.css" rel="stylesheet"></link>

<link href="<%=request.getContextPath()%>/css/custom.css"
	rel="stylesheet"></link>

<script
	src=https://ajax.googleapis.com/ajax/libs/angularjs/1.2.1/angular.min.js></script>
<script
	src=https://ajax.googleapis.com/ajax/libs/angularjs/1.2.1/angular-animate.min.js></script>
<script
	src=https://ajax.googleapis.com/ajax/libs/angularjs/1.2.1/angular-route.js></script>
<script
	src=https://ajax.googleapis.com/ajax/libs/angularjs/1.2.1/angular-cookies.js></script>
<script src=https://cdn.lfrs.sl/alloyui.com/2.0.0pr6/aui/aui-min.js></script>
<script
	src="https://cdnjs.cloudflare.com/ajax/libs/angular-ui-bootstrap/0.6.0/ui-bootstrap-tpls.min.js"></script>


<script src="<%=request.getContextPath()%>/js/gloriapi.js"></script>
<script src="<%=request.getContextPath()%>/js/app.js"></script>
<script src="<%=request.getContextPath()%>/js/solar/main.js"></script>
<script src="<%=request.getContextPath()%>/js/solar/ccds.js"></script>
<script src="<%=request.getContextPath()%>/js/solar/elapsed.js"></script>
<script src="<%=request.getContextPath()%>/js/solar/images.js"></script>
<script src="<%=request.getContextPath()%>/js/solar/mount.js"></script>
<script src="<%=request.getContextPath()%>/js/solar/scams.js"></script>
<script src="<%=request.getContextPath()%>/js/solar/weather.js"></script>

<%
	ThemeDisplay themeDisplay = (ThemeDisplay) request
			.getAttribute(WebKeys.THEME_DISPLAY);
	User user = themeDisplay.getUser();
%>

<div ng-app="toolbox" ng-controller="SolarMainCtrl">
	<div ng-init="user='<%= user.getEmailAddress() %>';password='<%= user.getPassword() %>'">
	<h3>Solar Experiment</h3>
	<hr class="divider">
	<div class="animate-show"
		ng-show="!reservationActive && rid != undefined">
		<div class="alert offset3 span6">
			<strong>Error!</strong> You do not have a reservation on this
			experiment.
		</div>
	</div>
	<div class="animate-show" ng-show="reservationActive">
		<div class="row">
			<div class="span5">
				<div align="center">
					<h5 class="label-info"
						style="margin-top: 0px; background-color: rgba(0, 136, 204, 0.13)">Purpose</h5>
				</div>
				<div class="info-text">Nam ac nisi quis sapien interdum
					accumsan. Cras volutpat elit vitae libero dapibus sagittis. Mauris
					imperdiet pretium justo, ac hendrerit ante mattis sed. Fusce non
					tempor velit, quis varius odio.</div>
			</div>
			<div class="span4">
				<div align="center">
					<h5 class="label-info"
						style="margin-top: 0px; background-color: rgba(0, 136, 204, 0.13)">Telescope
						description</h5>
				</div>
				<div class="telescope-desc" style="margin-top: 1px">
					<a
						style="position: absolute; width: 100%; height: 100%; text-decoration: none; background-color: #FFF, opacity:0; filter: alpha(opacity = 1);"
						href="http://gloria-project.eu/tag/tad-en/" target="about_blank"></a>
				</div>
				<div class="info-text"
					style="margin-left: 5px; float: left; width: 65%">
					This experiment interacts with the <strong>TADs</strong> installed
					at the Observatorio del Teide in Tenerife.
				</div>
			</div>
			<div class="span3" ng-controller="SolarMountCtrl">
				<div align="center">
					<h5 class="label-info"
						style="margin-top: 0px; background-color: rgba(0, 136, 204, 0.13)">Target</h5>
				</div>
				<div ng-show="!targetReady">
					<div class="mess-info" style="float: left; margin-left: 10px;">{{targetMessage}}</div>
				</div>
				<div class="animate-show" ng-show="targetReady">
					<div
						style="float: left; width: 30%; margin-left: 5px; cursor: pointer">
						<img ng-style="sunIconStyle" class="bright-button"
							src="<%=request.getContextPath()%>/img/sun-icon.png" ng-click="pointToTarget()">
					</div>
					<div ng-class="{'mess-info': inAction }"
						style="float: left; width: 62%; margin-left: 10px;">{{targetMessage}}</div>
				</div>

			</div>
		</div>
		<div class="row">
			<div class="span3" ng-controller="SolarScamCtrl">
				<div align="center">
					<h5 class="label-info"
						style="background-color: rgba(0, 136, 204, 0.13)">Exterior
						view</h5>
				</div>

				<div class="shadow" ng-repeat="image in scams"
					style="height: 166px; margin-bottom: 14px">
					<span ng-switch on="image.purl==undefined"> <img
						ng-switch-when="true" ng-src="<%=request.getContextPath()%>/img/wn4.gif"
						style="width: 216px; height: 162px; border: 2px solid rgba(0, 0, 0, 0.25); border-radius: 3px;">
						<img ng-switch-when="false" id="{{$index}}"
						ng-src="{{image.purl}}" err-SRC="<%=request.getContextPath()%>/img/wn4.gif"
						style="height: 162px; width: 216px; border: 2px solid rgba(0, 0, 0, 0.25); border-radius: 3px;">
					</span>
				</div>
			</div>
			<div ng-controller="SolarCCDCtrl">
				<div class="span6">
					<div align="center">
						<h5 class="label-info"
							style="background-color: rgba(0, 136, 204, 0.13)">Telescope
							sight</h5>
					</div>
					<div ng-mouseenter="status.main.focused=true"
						ng-mouseleave="status.main.focused=false">
						<div class="shadow" style="margin-top: 10px; height: 345px">
							<span ng-switch on="ccds[0].pcont==undefined"> <img
								ng-switch-when="true" ng-src="<%=request.getContextPath()%>/img/wn5.gif"
								style="max-width: 100%; height: 342px; border: 2px solid rgba(0, 0, 0, 0.25); border-radius: 3px">
								<img ng-switch-when="false" ng-src="{{ccds[0].pcont}}"
								err-SRC="<%=request.getContextPath()%>/img/wn5.gif"
								style="height: 342px; max-width: 100%; border: 2px solid rgba(0, 0, 0, 0.25); border-radius: 3px">
							</span>
							<div class="animate-show animate-hide"
								ng-show="ccds[0].pcont != undefined" style="position: relative;">
								<div class="arrows-control"
									ng-class="{'opaque': status.main.focused==true}"
									id="exposure-control" style="position: relative;">
									<div
										style="overflow: hidden; position: absolute; top: -285px; left: 26px; width: 13px; height: 230px; background-color: rgba(0, 136, 204, 0.13);">
										<div
											style="overflow: hidden; position: relative; height: 100%">
											<div class="images" ng-style="exposureBarStyle"
												style="position: absolute; left: 0px; width: 13px; height: 230px; background-color: rgba(204, 204, 204, 0.3);">

											</div>
										</div>
									</div>
									<div style="position: absolute; top: -330px; left: 23px;">
										<img ng-show="status.main.exposure.valueSet"
											ng-mouseup="endSetExposureTime()"
											ng-mousedown="beginSetExposureTime()"
											ng-click="setExposureTimeValue(1.0)"
											style="width: 20px; cursor: pointer" class="bright-button"
											src="<%=request.getContextPath()%>/img/plus.png">
									</div>
									<div style="position: absolute; top: -35px; left: 23px;">
										<img ng-mouseup="endSetExposureTime()"
											ng-mousedown="beginSetExposureTime()"
											ng-show="status.main.exposure.valueSet"
											ng-click="setExposureTimeValue(-1.0)"
											style="width: 20px; cursor: pointer" class="bright-button"
											src="<%=request.getContextPath()%>/img/minus.png">
									</div>
									<div ng-mouseenter="status.main.clock.focused=true"
										ng-mouseleave="status.main.clock.focused=false"
										ng-style="exposureStyle" class="images"
										style="position: absolute; left: 18px; cursor: pointer">
										<img class="bright-button" ng-click="setExposureTime()"
											style="float: left; width: 30px;" src="<%=request.getContextPath()%>/img/exposure.png">
										<div class="animate-show" ng-show="status.main.clock.focused"
											style="float: left; margin-top: 5px; margin-left: 5px">{{ccds[0].exposure
											| number:3}} s</div>
									</div>
								</div>
								<div class="arrows-control"
									ng-class="{'opaque': status.main.camera.focused}"
									ng-mouseenter="status.main.camera.focused=true"
									ng-mouseleave="status.main.camera.focused=false"
									style="position: absolute; top: -53px; left: 200px;">
									<img ng-show="imageTaken" ng-click="startExposure()"
										style="width: 43px; cursor: pointer" class="bright-button"
										src="<%=request.getContextPath()%>/img/take.png">
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="span3">
					<div align="center">
						<h5 class="label-info"
							style="background-color: rgba(0, 136, 204, 0.13)">Finder</h5>
					</div>
					<div ng-mouseenter="status.finder.focused=true"
						ng-mouseleave="status.finder.focused=false" align="center"
						style="margin-top: 1em">
						<div class="shadow circle"
							style="border: 5px solid rgba(0, 0, 0, 0.25); height: 198px; width: 198px;">
							<div ng-switch on="ccds[1].pcont==undefined"
								style="margin-left: -33px">
								<img ng-switch-when="true" ng-src="<%=request.getContextPath()%>/img/wn3.gif"
									style="height: 198px;"> <img
									ng-switch-when="false" ng-src="{{ccds[1].pcont}}"
									style="height: 198px; max-width: 150%;" err-SRC="<%=request.getContextPath()%>/img/wn3.gif">
							</div>
						</div>
						<!-- http://jsfiddle.net/jackJoe/YhDXm/-->
						<div style="position: relative;">
							<div ng-show="arrowsEnabled" class="arrows-control animate-show"
								ng-class="{'opaque': status.finder.focused==true}">
								<div
									style="position: absolute; width: 15%; top: -28px; left: 94px; cursor: pointer;">
									<img class="bright-button" src="<%=request.getContextPath()%>/img/down.png"
										ng-click="moveFinder('SOUTH')">
								</div>
								<div
									style="position: absolute; width: 15%; top: -203px; left: 94px; cursor: pointer;">
									<img class="bright-button" src="<%=request.getContextPath()%>/img/up.png"
										ng-click="moveFinder('NORTH')">
								</div>
								<div
									style="position: absolute; width: 8%; top: -123px; left: 14px; cursor: pointer;">
									<img class="bright-button" src="<%=request.getContextPath()%>/img/left.png"
										ng-click="moveFinder('WEST')">
								</div>
								<div
									style="position: absolute; width: 8%; top: -123px; left: 188px; cursor: pointer;">
									<img class="bright-button" src="<%=request.getContextPath()%>/img/right.png"
										ng-click="moveFinder('EAST')">
								</div>
							</div>
							<div
								style="position: absolute; width: 20%; top: -130px; left: 90px; opacity: 0.6;">
								<img src="<%=request.getContextPath()%>/img/pointer.png">
							</div>
						</div>
					</div>
					<div ng-controller="SolarWeatherCtrl"
						style="margin-top: 14px; height: 63px" align="center">
						<h5 class="label-info"
							style="background-color: rgba(0, 136, 204, 0.13)">Weather
							conditions</h5>
						<div ng-show="!valuesLoaded">
							<div class="mess-info" style="float: left; margin-left: 10px;">Looking
								for weather info.</div>
						</div>
						<div class="animate-show" ng-show="valuesLoaded"
							style="overflow: hidden">
							<div ng-class="{'mess-info': rh.high}"
								style="float: left; display: inline-block; width: 50%">
								<div style="width: 30%; float: left;">
									<img src="<%=request.getContextPath()%>/img/gota.png">
								</div>
								<div ng-style="rh.style"
									style="float: left; margin-top: 5px; margin-left: 4px">{{rh.value}}
									%</div>
							</div>
							<div ng-class="{'mess-info': wind.high}"
								style="float: left; display: inline-block; width: 50%">
								<div style="width: 30%; float: left;">
									<img src="<%=request.getContextPath()%>/img/viento.png">
								</div>
								<div ng-style="wind.style"
									style="float: left; margin-top: 5px; margin-left: 8px">{{wind.value}}
									m/s</div>
							</div>
						</div>
						<div style="display: none"></div>
					</div>
					<div style="margin-top: 14px;" align="center"
						ng-controller="SolarElapsedCtrl">
						<div align="center">
							<h5 class="label-info"
								style="margin-top: 0px; background-color: rgba(0, 136, 204, 0.13)">Elapsed
								time</h5>
						</div>
						<div class="animate-show" ng-show="loaded">
							<div class="progress"
								style="background-image: none; background-color: rgba(0, 0, 0, 0.25); height: 10px; width: 95%">
								<div ng-style="progressStyle" class="bar"
									style="background-image: none; background-color: silver"></div>
							</div>
						</div>
						<div ng-show="!loaded">
							<div class="mess-info" style="float: left; margin-left: 10px;">Calculating.</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="row">
			<div ng-controller="SolarImagesCtrl" class="span9"
				style="height: 100px">
				<div align="center">
					<h5 class="label-info"
						style="margin-top: 0px; background-color: rgba(0, 136, 204, 0.13)">Your
						images</h5>
				</div>
				<div
					style="float: left; cursor: pointer; width: 18px; margin-top: 12px; margin-left: 12px; height: 36px">
					<img ng-show="currentIndex > 0" class="animate-show bright-button"
						src="<%=request.getContextPath()%>/img/left.png" ng-click="nextLeft()">
				</div>
				<div
					style="float: left; position: relative; overflow: hidden; width: 616px; height: 70px; margin-left: 15px; margin-right: 15px;"
					class="span8 animate-show">
					<div class="images" ng-style="sliderStyle" id="thumbnails"
						style="width: 850px; position: absolute;">
						<div class="image-thumb" style="margin-top: 2px"
							ng-repeat="image in images | filter:filterFn"
							ng-animate="{enter: 'animate-enter', leave: 'animate-leave'}">
							<div style="position: relative">
								<a> <img ng-click="open(image)" style="border-radius: 3px; cursor: pointer"
									class="bright-button" ng-src="{{image.jpg}}" alt="">
								</a>
								<div style="opacity: 1.0; position: absolute; top: 65%; left: 5%">
									{{image.order}}</div>
							</div>
						</div>
					</div>
				</div>
				<div
					style="float: left; cursor: pointer; width: 18px; margin-top: 12px; height: 36px">
					<img ng-show="currentIndex + 6 < images.length"
						class="animate-show bright-button" src="<%=request.getContextPath()%>/img/right.png"
						ng-click="nextRight()">
				</div>
				<div>
					<script type="text/ng-template" id="myModalContent.html">
						<div>
    	    				<div class="modal-header">
		            			<h3>Image {{image.order}}</h3>
        					</div>
        					<div class="modal-body" style="max-height: 1000px;">
	            				<img ng-src="{{image.jpg}}">        			
        					</div>
        					<div class="modal-footer" style="background-color: rgba(0, 0, 0, 0.6); border: none">
								<p class="pull-left">You took this image at {{image.date | UTCTimeFilter}}.</p>
								<a class="btn btn-primary" download="image.jpg" ng-href="{{image.jpg + '&download=true'}}">JPEG</a>
								<a class="btn btn-warning" download="image.jpg" ng-href="{{image.fits + '&download=true'}}">FITS</a>            					
        					</div>
						</div>
   			 		</script>
				</div>
			</div>
			<div class="span3" align="center">
				<div align="center">
					<h5 class="label-info"
						style="margin-top: 0px; margin-bottom: 15px; background-color: rgba(0, 136, 204, 0.13)">Measure
						solar activity</h5>
				</div>
				<a target="about_blank"
					href="https://play.google.com/store/apps/details?id=com.gloria.offlineexperiments">
					<img alt="Solar Activity Experiment on Android"
					src="<%=request.getContextPath()%>/img/google_play.png" />
				</a>
			</div>
		</div>
	</div>
</div>