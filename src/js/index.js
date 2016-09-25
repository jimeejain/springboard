angular.module("springboardApp",["ngRoute"])
.config(["$routeProvider",function($routeProvider){
	$routeProvider
		.when("/",{
			templateUrl:"./views/home.html",
			controller:"homeController",
			controllerAs:"home"
		})
		.when("/paths",{
			templateUrl:"./views/paths.html",
			controller:"pathListController",
			controllerAs:"pathList"
		})
		.when("/path/:pathId",{
			templateUrl:"./views/pathView.html",
			controller:"pathDetailsController",
			controllerAs:"path"
		})
		.when("/error",{
			templateUrl:"./views/error.html",
		})
		.otherwise({
			redirectTo:"/error"
		})
}])