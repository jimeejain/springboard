class HomeController{
	constructor($location){
		this.$location = $location;
	}
	explore(){
		this.$location.path("/paths");
	}
}
HomeController.$inject = ["$location"];