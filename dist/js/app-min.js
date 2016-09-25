"use strict";function _classCallCheck(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function _classCallCheck(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function _classCallCheck(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function _classCallCheck(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function _classCallCheck(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}angular.module("springboardApp",["ngRoute"]).config(["$routeProvider",function(t){t.when("/",{templateUrl:"/views/home.html",controller:"homeController",controllerAs:"home"}).when("/paths",{templateUrl:"/views/paths.html",controller:"pathListController",controllerAs:"pathList"}).when("/path/:pathId",{templateUrl:"/views/pathView.html",controller:"pathDetailsController",controllerAs:"path"}).when("/error",{templateUrl:"/views/error.html"}).otherwise({redirectTo:"/error"})}]);var _createClass=function(){function t(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}return function(e,n,r){return n&&t(e.prototype,n),r&&t(e,r),e}}(),PathService=function(){function t(e,n){_classCallCheck(this,t),this.$http=e,this.$q=n,this.pathListResponse=null}return _createClass(t,[{key:"getPathFromWeb",value:function(){return this.$http({url:"https://hackerearth.0x10.info/api/learning-paths?type=json&query=list_paths",method:"GET"})}},{key:"getPaths",value:function(){var t=this;return this.$q(function(e,n){t.pathListResponse?e(t.pathListResponse):t.getPathFromWeb().then(function(n){t.pathListResponse=t.processData(n.data),e(t.pathListResponse)},function(t){n(t)})})}},{key:"getPath",value:function(t){var e=this;return this.$q(function(n,r){e.pathListResponse?n(e.findByKey(e.pathListResponse.paths,"id",t)):e.getPaths().then(function(r){n(e.findByKey(r.paths,"id",t))},function(t){r(t)})})}},{key:"findByKey",value:function(t,e,n){for(var r=0,a=t.length;r<a;r++)if(t[r][e]==n)return t[r];return null}},{key:"processData",value:function(t){var e=this;return t.paths=t.paths.map(function(t,n,r){return t.id=parseInt(t.id),t.learner=parseInt(t.learner.replace(/,/g,"")),t.hours=parseInt(t.hours),t.tagsArr=t.tags.split(",").map(function(t){return t.trim()}).filter(function(t){return""!=t&&void 0!=t}),t.likeCount=e.getLocalStoredLikeCount(t.id),t}),t.tags=t.paths.reduce(function(t,e){return e.tagsArr.forEach(function(e){t.indexOf(e)==-1&&t.push(e)}),t},[]),t}},{key:"getLocalStoredLikeCount",value:function(t){try{var e=localStorage.getItem(t);return e?parseInt(e):0}catch(t){return 0}}},{key:"updateLike",value:function(t,e){try{localStorage.setItem(""+t,""+e)}catch(t){console.error("localStorage not supported")}}}]),t}();PathService.$inject=["$http","$q"];var _createClass=function(){function t(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}return function(e,n,r){return n&&t(e.prototype,n),r&&t(e,r),e}}(),HomeController=function(){function t(e){_classCallCheck(this,t),this.$location=e}return _createClass(t,[{key:"explore",value:function(){this.$location.path("/paths")}}]),t}();HomeController.$inject=["$location"];var MainController=function t(e){_classCallCheck(this,t),this.appTitle="SpringBoard",console.log("inside main controller")};MainController.$inject=["$scope"];var _createClass=function(){function t(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}return function(e,n,r){return n&&t(e.prototype,n),r&&t(e,r),e}}(),PathDetailsController=function(){function t(e,n,r,a){_classCallCheck(this,t),this.PathService=e,this.$location=r,this.$timeout=a,this.pathId=n.pathId,this.details={},this.availablePaths=[],this.getPath(this.pathId),this.currentSlideIndex=0}return _createClass(t,[{key:"getPath",value:function(t){var e=this;this.PathService.getPath(t).then(function(t){e.details=t,null==t&&e.$location.path("/error"),e.getPaths(),console.log("getting path",t)},function(t){console.log(t)})}},{key:"getPaths",value:function(){var t=this;this.PathService.getPaths().then(function(e){t.availablePaths=e.paths,t.carousel(),console.log("get path in detail view",t.availablePaths)},function(t){console.log(t)})}},{key:"carousel",value:function(){var t=this;this.currentSlideIndex++,this.currentSlideIndex>=this.availablePaths.length&&(this.currentSlideIndex=0),this.$timeout(function(){t.carousel()},3e3)}}]),t}();PathDetailsController.$inject=["PathService","$routeParams","$location","$timeout"];var _createClass=function(){function t(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}return function(e,n,r){return n&&t(e.prototype,n),r&&t(e,r),e}}(),PathListController=function(){function t(e,n){_classCallCheck(this,t),this.PathService=e,this.$location=n,this.availablePaths=[],this.tags=[],this.quoteAvailable=0,this.quoteMax=0,this.query="",this.tagQuery="",this.filterTags=[],this.orderByKey="id",this.orderByAsc=!0,this.getPaths()}return _createClass(t,[{key:"getPaths",value:function(){var t=this;this.PathService.getPaths().then(function(e){t.availablePaths=e.paths,t.tags=e.tags,t.quoteAvailable=e.quote_available,t.quoteMax=e.quote_max,console.log(e)},function(t){console.log(t)})}},{key:"showDetails",value:function(t){this.$location.path("/path/"+t)}},{key:"likeDislike",value:function(t){var e=arguments.length<=1||void 0===arguments[1]||arguments[1];e?t.likeCount=t.likeCount+1:t.likeCount=t.likeCount-1,this.PathService.updateLike(t.id,t.likeCount)}},{key:"clearTags",value:function(){this.filterTags=[]}},{key:"addFilterTags",value:function(t){var e=this.filterTags.indexOf(t);e==-1?this.filterTags.push(t):this.filterTags.splice(e,1)}},{key:"setOrder",value:function(t){this.orderByKey==t?this.orderByAsc=!this.orderByAsc:(this.orderByKey=t,this.orderByAsc=!0)}}]),t}();PathListController.$inject=["PathService","$location"],angular.module("springboardApp").controller("mainController",MainController).controller("homeController",HomeController).controller("pathListController",PathListController).controller("pathDetailsController",PathDetailsController),angular.module("springboardApp").filter("tagFilter",function(){return function(t,e){return void 0==e||0==e.length?t:t.filter(function(t){for(var n=t.tagsArr,r=0,a=n.length;r<a;r++)if(~e.indexOf(n[r]))return!0;return!1})}}).filter("tagSearch",function(){return function(t,e){return e=e.toLowerCase(),t.filter(function(t){return~t.toLowerCase().indexOf(e)})}}).filter("searchFilter",function(){return function(t,e){return e?(e=e.trim().toLowerCase(),t.filter(function(t){return~t.name.toLowerCase().indexOf(e)||~t.description.toLowerCase().indexOf(e)||~t.tags.toLowerCase().indexOf(e)})):t}}).filter("orderFilter",function(){return function(t,e,n){var r=!1,a=["id","learner","hours"];~a.indexOf(e)&&(r=!0);return t.sort(function(t,a){return t=t[e],a=a[e],r?n?t-a:a-t:n?t.localeCompare(a):a.localeCompare(t)}),t}}),angular.module("springboardApp").service("PathService",PathService);