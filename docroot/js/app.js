'use strict';

/* App Module */

var toolbox = angular.module('toolbox', [ 'ngAnimate',
		'gloria', 'ui.bootstrap' ]);

toolbox.directive('errSrc', function() {
	return {
		link : function(scope, element, attrs) {
			element.bind('error', function() {
				element.attr('src', attrs.errSrc);
			});
		}
	};
});

toolbox.filter('UTCFullFilter', function() {
	return function(input) {
		return new Date(input).toUTCString();
	};
});

toolbox.filter('UTCTimeFilter', function() {
	return function(input) {
		var date = new Date(input);
		var dateStr = '' + pad(date.getUTCHours());
		dateStr += ':' + pad(date.getUTCMinutes());
		dateStr += ' UT';
		return dateStr;
	};
});

toolbox.filter('TimeFilter', function() {
	return function(input) {
		var date = new Date(input);
		var dateStr = '' + pad(date.getHours());
		dateStr += ':' + pad(date.getMinutes());
		return dateStr;
	};
});

toolbox.filter('DateFilter', function() {
	return function(input) {
		var date = new Date(input);
		var dateStr = '' + pad(date.getMonth());
		dateStr += '/' + pad(date.getDate());
		dateStr += '/' + pad(date.getFullYear());
		return dateStr;
	};
});

toolbox.filter('UTCDateFilter', function() {
	return function(input) {
		var date = new Date(input);
		var dateStr = '' + pad(date.getUTCMonth());
		dateStr += '/' + pad(date.getUTCDate());
		dateStr += '/' + pad(date.getUTCFullYear());
		dateStr += ' UT';
		return dateStr;
	};
});