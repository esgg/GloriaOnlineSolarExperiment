'use strict';

var host = 'ws.users.gloria-project.eu';
var protocol = 'https';
var port = '8443';

/*
 * var host = 'localhost'; var protocol = 'http'; var port = '8080';
 */
/* App Module */
var gloria = angular.module('gloria', []);

gloria.config([ '$httpProvider', function($httpProvider) {
	$httpProvider.defaults.useXDomain = true;
} ]);

gloria.factory('HttpWrapper', function($http) {
	var authorization = null;
	var wrapper = {
		setAuthorization : function(auth) {
			authorization = auth;
		},
		http : function(options) {
			if (authorization) {

				options.url = protocol + '://' + host + ':' + port + '/'
						+ options.url;
				options.headers = options.headers || {};
				options.headers.authorization = authorization;
			}

			return $http(options);
		},
		getAuthorization : function() {
			return authorization;
		}
	};

	return wrapper;
});

gloria.factory('$sequenceFactory', function($q) {

	return {
		getSequence : function() {
			var sequence = new SequenceHandler($q);
			return sequence;
		}
	};
});

function SequenceHandler($q) {
	var queue = [];

	var execNext = function() {
		var task = queue[0];
		task.f().then(function(response) {
			queue.shift();
			task.d.resolve(response);
			if (queue.length > 0)
				execNext();
		}, function(response) {
			task.d.reject(response);
		});
	};

	this.execute = function(config) {
		var d = $q.defer();
		queue.push({
			f : config,
			d : d
		});
		if (queue.length === 1)
			execNext();
		return d.promise;
	};
}

gloria.factory('GloriaAPI', function(HttpWrapper, $q) {
	var api = new GloriaApiHandler(HttpWrapper, $q);

	return api;
});

function GloriaApiHandler(HttpWrapper, $q) {

	this.httpWrapper = HttpWrapper;

	this.setHttp = function(handler) {
		this.httpWrapper = handler;
	};

	this.processRequest = function(method, url, data, success, error,
			unauthorized) {
		var promise = this.httpWrapper.http({
			method : method,
			url : url,
			data : angular.toJson(data)
		});

		var defer = $q.defer();

		promise = promise.then(function(response) {
			if (response.status == 200) {
				if (success != undefined) {
					var returnData = response.data;
					if (response.data != undefined && response.data != null
							&& response.data != '') {
						returnData = angular.fromJson(returnData);
					}

					success(returnData, response.status);
					defer.resolve(response);
				}
			} else {
				if (error != undefined) {
					var returnData = response.data;
					if (response.status != 401 && response.data != undefined
							&& response.data != null && response.data != '') {
						returnData = angular.fromJson(returnData);
					}
					error(returnData, response.status);

				}

				if (unauthorized != undefined && response.status == 401) {
					unauthorized();
				}

				defer.reject(response);
				console.log(response);
			}

			return response.data;

		}, function(response) {
			if (error != undefined) {
				var returnData = response.data;
				if (response.status != 401 && response.data != undefined
						&& response.data != null && response.data != '') {
					returnData = angular.fromJson(returnData);
				}
				error(returnData, response.status);
			}
			defer.reject(response);
			console.log(response);
			return response.data;
		});

		return defer.promise;
	};

	/* User authentication */
	this.setCredentials = function(username, password) {
		this.httpWrapper.setAuthorization('Basic '
				+ Base64.encode(username + ':' + password));
	};

	this.clearCredentials = function() {
		this.httpWrapper.setAuthorization(null);
	};

	this.authenticate = function(success, error) {

		return this.processRequest('get', 'GLORIAAPI/users/authenticate', null,
				success, error);
	};

	this.verifyToken = function(success, error) {

		return this.processRequest('get',
				'GLORIAAPI/users/authenticate?verify=true', null, success,
				error);
	};

	/* Experiment reservations management */
	this.getPendingReservations = function(success, error) {

		return this.processRequest('get', 'GLORIAAPI/experiments/pending',
				null, success, error);
	};

	this.getOfflinePendingReservations = function(success, error) {

		return this.processRequest('get',
				'GLORIAAPI/experiments/offline/pending', null, success, error);
	};

	this.getOnlinePendingReservations = function(success, error) {

		return this.processRequest('get',
				'GLORIAAPI/experiments/online/pending', null, success, error);
	};

	this.getActiveReservations = function(success, error) {

		return this.processRequest('get', 'GLORIAAPI/experiments/active', null,
				success, error);
	};

	this.getOfflineActiveReservations = function(success, error) {

		return this.processRequest('get',
				'GLORIAAPI/experiments/offline/active', null, success, error);
	};

	this.getOnlineActiveReservations = function(success, error) {

		return this.processRequest('get',
				'GLORIAAPI/experiments/online/active', null, success, error);
	};

	this.getAvailableReservations = function(experiment, telescopes, date,
			success, error) {
		return this.processRequest('post',
				'GLORIAAPI/experiments/online/slots/available/'
						+ date.getFullYear() + '/' + date.getMonth() + '/'
						+ date.getDate(), {
					experiment : experiment,
					telescopes : telescopes
				}, success, error);
	};

	this.makeReservation = function(experiment, telescopes, begin, end,
			success, error) {

		return this.processRequest('post',
				'GLORIAAPI/experiments/online/reserve', {
					experiment : experiment,
					telescopes : telescopes,
					begin : begin,
					end : end
				}, success, error);
	};

	this.applyForOffline = function(experiment, success, error) {

		return this.processRequest('get',
				'GLORIAAPI/experiments/offline/apply?experiment=' + experiment,
				null, success, error);
	};

	/* Experiment context management */
	this.getParameterValue = function(cid, name, success, error) {
		return this.processRequest('get', 'GLORIAAPI/experiments/context/'
				+ cid + '/parameters/' + name, null, success, error);
	};

	this.getParameterTreeValue = function(cid, name, tree, success, error) {

		return this.processRequest('get', 'GLORIAAPI/experiments/context/'
				+ cid + '/parameters/' + name + '?tree=' + tree, null, success,
				error);
	};

	this.setParameterValue = function(cid, name, value, success, error) {

		return this.processRequest('post', 'GLORIAAPI/experiments/context/'
				+ cid + '/parameters/' + name, value, success, error);
	};

	this.setParameterTreeValue = function(cid, name, tree, value, success,
			error) {
		return this.processRequest('post', 'GLORIAAPI/experiments/context/'
				+ cid + '/parameters/' + name + '?tree=' + tree, value,
				success, error);
	};

	this.executeOperation = function(cid, name, success, error) {
		return this.processRequest('get', 'GLORIAAPI/experiments/context/'
				+ cid + '/execute/' + name, null, success, error);
	};

	this.getElapsedTime = function(cid, success, error) {
		return this.processRequest('get', 'GLORIAAPI/experiments/context/'
				+ cid + '/elapsed', null, success, error);
	};

	this.getRemainingTime = function(cid, success, error) {
		return this.processRequest('get', 'GLORIAAPI/experiments/context/'
				+ cid + '/remaining', null, success, error);
	};

	this.getImagesByContext = function(cid, success, error) {
		return this.processRequest('get', 'GLORIAAPI/images/list/context/'
				+ cid, null, success, error);
	};

	this.getImagesByDate = function(year, month, day, success, error) {
		return this.processRequest('get', 'GLORIAAPI/images/list/' + year + '/'
				+ month + '/' + day + "?complete=true&maxResults=30", null,
				success, error);
	};
}

/**
 * 
 * Base64 encode / decode http://www.webtoolkit.info/
 * 
 */

var Base64 = {

	// private property
	_keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

	// public method for encoding
	encode : function(input) {
		var output = "";
		var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
		var i = 0;

		input = Base64._utf8_encode(input);

		while (i < input.length) {

			chr1 = input.charCodeAt(i++);
			chr2 = input.charCodeAt(i++);
			chr3 = input.charCodeAt(i++);

			enc1 = chr1 >> 2;
			enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
			enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
			enc4 = chr3 & 63;

			if (isNaN(chr2)) {
				enc3 = enc4 = 64;
			} else if (isNaN(chr3)) {
				enc4 = 64;
			}

			output = output + this._keyStr.charAt(enc1)
					+ this._keyStr.charAt(enc2) + this._keyStr.charAt(enc3)
					+ this._keyStr.charAt(enc4);

		}

		return output;
	},

	// public method for decoding
	decode : function(input) {
		var output = "";
		var chr1, chr2, chr3;
		var enc1, enc2, enc3, enc4;
		var i = 0;

		input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

		while (i < input.length) {

			enc1 = this._keyStr.indexOf(input.charAt(i++));
			enc2 = this._keyStr.indexOf(input.charAt(i++));
			enc3 = this._keyStr.indexOf(input.charAt(i++));
			enc4 = this._keyStr.indexOf(input.charAt(i++));

			chr1 = (enc1 << 2) | (enc2 >> 4);
			chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
			chr3 = ((enc3 & 3) << 6) | enc4;

			output = output + String.fromCharCode(chr1);

			if (enc3 != 64) {
				output = output + String.fromCharCode(chr2);
			}
			if (enc4 != 64) {
				output = output + String.fromCharCode(chr3);
			}

		}

		output = Base64._utf8_decode(output);

		return output;

	},

	// private method for UTF-8 encoding
	_utf8_encode : function(string) {
		string = string.replace(/\r\n/g, "\n");
		var utftext = "";

		for (var n = 0; n < string.length; n++) {

			var c = string.charCodeAt(n);

			if (c < 128) {
				utftext += String.fromCharCode(c);
			} else if ((c > 127) && (c < 2048)) {
				utftext += String.fromCharCode((c >> 6) | 192);
				utftext += String.fromCharCode((c & 63) | 128);
			} else {
				utftext += String.fromCharCode((c >> 12) | 224);
				utftext += String.fromCharCode(((c >> 6) & 63) | 128);
				utftext += String.fromCharCode((c & 63) | 128);
			}

		}

		return utftext;
	},

	// private method for UTF-8 decoding
	_utf8_decode : function(utftext) {
		var string = "";
		var i = 0;
		var c = c1 = c2 = 0;

		while (i < utftext.length) {

			c = utftext.charCodeAt(i);

			if (c < 128) {
				string += String.fromCharCode(c);
				i++;
			} else if ((c > 191) && (c < 224)) {
				c2 = utftext.charCodeAt(i + 1);
				string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
				i += 2;
			} else {
				c2 = utftext.charCodeAt(i + 1);
				c3 = utftext.charCodeAt(i + 2);
				string += String.fromCharCode(((c & 15) << 12)
						| ((c2 & 63) << 6) | (c3 & 63));
				i += 3;
			}

		}

		return string;
	}
};