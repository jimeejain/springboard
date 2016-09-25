"use strict";

angular.module("springboardApp", ["ngRoute"]).config(["$routeProvider", function ($routeProvider) {
	$routeProvider.when("/", {
		templateUrl: "./views/home.html",
		controller: "homeController",
		controllerAs: "home"
	}).when("/paths", {
		templateUrl: "./views/paths.html",
		controller: "pathListController",
		controllerAs: "pathList"
	}).when("/path/:pathId", {
		templateUrl: "./views/pathView.html",
		controller: "pathDetailsController",
		controllerAs: "path"
	}).when("/error", {
		templateUrl: "./views/error.html"
	}).otherwise({
		redirectTo: "/error"
	});
}]);
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PathService = function () {
	function PathService($http, $q) {
		_classCallCheck(this, PathService);

		this.$http = $http;
		this.$q = $q;
		this.pathListResponse = null;
	}

	_createClass(PathService, [{
		key: "getPathFromWeb",
		value: function getPathFromWeb() {
			return this.$http({
				url: "https://hackerearth.0x10.info/api/learning-paths?type=json&query=list_paths",
				//url:"data.json",
				method: "GET"
			});
		}
	}, {
		key: "getPaths",
		value: function getPaths() {
			var _this = this;

			return this.$q(function (resolve, reject) {
				if (_this.pathListResponse) {
					resolve(_this.pathListResponse);
				} else {
					_this.getPathFromWeb().then(function (response) {
						_this.pathListResponse = _this.processData(response.data);
						resolve(_this.pathListResponse);
					}, function (error) {
						reject(error);
					});
				}
			});
		}
	}, {
		key: "getPath",
		value: function getPath(pathId) {
			var _this2 = this;

			return this.$q(function (resolve, reject) {
				if (_this2.pathListResponse) {
					resolve(_this2.findByKey(_this2.pathListResponse.paths, "id", pathId));
				} else {
					_this2.getPaths().then(function (data) {
						resolve(_this2.findByKey(data.paths, "id", pathId));
					}, function (error) {
						reject(error);
					});
				}
			});
		}
	}, {
		key: "findByKey",
		value: function findByKey(arr, key, value) {
			for (var i = 0, len = arr.length; i < len; i++) {
				if (arr[i][key] == value) {
					return arr[i];
				}
			}
			return null;
		}
	}, {
		key: "processData",
		value: function processData(data) {
			var _this3 = this;

			data.paths = data.paths.map(function (u, i, arr) {
				u.id = parseInt(u.id);
				u.learner = parseInt(u.learner.replace(/,/g, ""));
				u.hours = parseInt(u.hours);
				u.tagsArr = u.tags.split(",").map(function (u) {
					return u.trim();
				}).filter(function (u) {
					return u != "" && u != undefined;
				});
				u.likeCount = _this3.getLocalStoredLikeCount(u.id);
				return u;
			});
			data.tags = data.paths.reduce(function (allTags, unitPath) {
				unitPath.tagsArr.forEach(function (unitTag) {
					if (allTags.indexOf(unitTag) == -1) {
						allTags.push(unitTag);
					}
				});
				return allTags;
			}, []);
			return data;
		}
	}, {
		key: "getLocalStoredLikeCount",
		value: function getLocalStoredLikeCount(id) {
			try {
				var likeCount = localStorage.getItem(id);
				return likeCount ? parseInt(likeCount) : 0;
			} catch (Error) {
				return 0;
			}
		}
	}, {
		key: "updateLike",
		value: function updateLike(id, likeCount) {
			try {
				localStorage.setItem("" + id, "" + likeCount);
			} catch (error) {
				console.error("localStorage not supported");
			}
		}
	}]);

	return PathService;
}();

PathService.$inject = ["$http", "$q"];
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var HomeController = function () {
	function HomeController($location) {
		_classCallCheck(this, HomeController);

		this.$location = $location;
	}

	_createClass(HomeController, [{
		key: "explore",
		value: function explore() {
			this.$location.path("/paths");
		}
	}]);

	return HomeController;
}();

HomeController.$inject = ["$location"];
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MainController = function MainController($scope) {
	_classCallCheck(this, MainController);

	this.appTitle = "SpringBoard";
	console.log("inside main controller");
};

MainController.$inject = ['$scope'];
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PathDetailsController = function () {
	function PathDetailsController(PathService, $routeParams, $location, $timeout) {
		_classCallCheck(this, PathDetailsController);

		this.PathService = PathService;
		this.$location = $location;
		this.$timeout = $timeout;
		this.pathId = $routeParams.pathId;
		this.details = {};
		this.availablePaths = [];

		this.getPath(this.pathId);

		this.currentSlideIndex = 0;
	}

	_createClass(PathDetailsController, [{
		key: "getPath",
		value: function getPath(pathId) {
			var _this = this;

			this.PathService.getPath(pathId).then(function (data) {
				_this.details = data;
				if (data == null) {
					_this.$location.path("/error");
				}
				_this.getPaths();
				console.log("getting path", data);
			}, function (error) {
				console.log(error);
			});
		}
	}, {
		key: "getPaths",
		value: function getPaths() {
			var _this2 = this;

			this.PathService.getPaths().then(function (data) {
				_this2.availablePaths = data.paths;
				_this2.carousel();
				console.log("get path in detail view", _this2.availablePaths);
			}, function (error) {
				console.log(error);
			});
		}
	}, {
		key: "carousel",
		value: function carousel() {
			var _this3 = this;

			this.currentSlideIndex++;
			if (this.currentSlideIndex >= this.availablePaths.length) {
				this.currentSlideIndex = 0;
			}
			this.$timeout(function () {
				_this3.carousel();
			}, 3000);
		}
	}]);

	return PathDetailsController;
}();

PathDetailsController.$inject = ["PathService", "$routeParams", "$location", "$timeout"];
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PathListController = function () {
	function PathListController(PathService, $location) {
		_classCallCheck(this, PathListController);

		this.PathService = PathService;
		this.$location = $location;

		this.availablePaths = [];
		this.tags = [];
		this.quoteAvailable = 0;
		this.quoteMax = 0;

		this.query = "";
		this.tagQuery = "";
		this.filterTags = [];
		this.orderByKey = "id";
		this.orderByAsc = true;

		this.isSideBarActive = true;
		this.getPaths();
	}

	_createClass(PathListController, [{
		key: "getPaths",
		value: function getPaths() {
			var _this = this;

			this.PathService.getPaths().then(function (data) {
				_this.availablePaths = data.paths;
				_this.tags = data.tags;
				_this.quoteAvailable = data.quote_available;
				_this.quoteMax = data.quote_max;
				console.log(data);
			}, function (error) {
				console.log(error);
			});
		}
	}, {
		key: "showDetails",
		value: function showDetails(pathId) {
			this.$location.path("/path/" + pathId);
		}
	}, {
		key: "likeDislike",
		value: function likeDislike(pathObj) {
			var isLike = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];

			if (isLike) {
				pathObj.likeCount = pathObj.likeCount + 1;
			} else {
				pathObj.likeCount = pathObj.likeCount - 1;
			}
			this.PathService.updateLike(pathObj.id, pathObj.likeCount);
		}
	}, {
		key: "clearTags",
		value: function clearTags() {
			this.filterTags = [];
		}
	}, {
		key: "addFilterTags",
		value: function addFilterTags(tag) {
			var tagIndex = this.filterTags.indexOf(tag);
			if (tagIndex == -1) {
				this.filterTags.push(tag);
			} else {
				this.filterTags.splice(tagIndex, 1);
			}
		}
	}, {
		key: "setOrder",
		value: function setOrder(key) {
			if (this.orderByKey == key) {
				this.orderByAsc = !this.orderByAsc;
			} else {
				this.orderByKey = key;
				this.orderByAsc = true;
			}
		}
	}]);

	return PathListController;
}();

PathListController.$inject = ["PathService", "$location"];
"use strict";

angular.module("springboardApp").controller("mainController", MainController).controller("homeController", HomeController).controller("pathListController", PathListController).controller("pathDetailsController", PathDetailsController);
"use strict";

angular.module("springboardApp").filter("tagFilter", function () {
	return function (inputPaths, filterTags) {
		if (filterTags == undefined || filterTags.length == 0) {
			return inputPaths;
		}
		return inputPaths.filter(function (unitPath) {
			var tags = unitPath.tagsArr;
			for (var i = 0, len = tags.length; i < len; i++) {
				if (~filterTags.indexOf(tags[i])) {
					return true;
				}
			}
			return false;
		});
	};
}).filter("tagSearch", function () {
	return function (inputTags, query) {
		query = query.toLowerCase();
		return inputTags.filter(function (unit) {
			return ~unit.toLowerCase().indexOf(query);
		});
	};
}).filter("searchFilter", function () {
	return function (inputPaths, query) {
		if (!query) {
			return inputPaths;
		}
		query = query.trim().toLowerCase();
		return inputPaths.filter(function (unit) {
			return ~unit.name.toLowerCase().indexOf(query) || ~unit.description.toLowerCase().indexOf(query) || ~unit.tags.toLowerCase().indexOf(query);
		});
	};
}).filter("orderFilter", function () {
	return function (inputPaths, orderKey, isAsc) {
		var isNumber = false;
		var numberKeys = ["id", "learner", 'hours'];
		if (~numberKeys.indexOf(orderKey)) {
			isNumber = true;
		}
		var sortedPath = [];

		inputPaths.sort(function (a, b) {
			a = a[orderKey];
			b = b[orderKey];
			if (isNumber) {
				if (isAsc) {
					return a - b;
				} else {
					return b - a;
				}
			} else {
				if (isAsc) {
					return a.localeCompare(b);
				} else {
					return b.localeCompare(a);
				}
			}
		});
		return inputPaths;
	};
});
"use strict";

angular.module("springboardApp").service("PathService", PathService);
//# sourceMappingURL=app.js.map
