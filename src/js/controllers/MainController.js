class MainController{
	constructor($scope){
		this.appTitle = "SpringBoard";
		console.log("inside main controller");
	}
}
MainController.$inject = ['$scope'];