class PathDetailsController{
	constructor(PathService,$routeParams,$location,$timeout){
		this.PathService = PathService;
		this.$location = $location;
		this.$timeout = $timeout;
		this.pathId = $routeParams.pathId;
		this.details = {};
		this.availablePaths = [];
		
		this.getPath(this.pathId);

		this.currentSlideIndex= 0;
	}
	getPath(pathId){
		this.PathService.getPath(pathId)
			.then((data)=>{
				this.details = data;
				if(data == null){
					this.$location.path("/error")
				}
				this.getPaths();
				console.log("getting path",data);
			},(error)=>{
				console.log(error);
			})
	}
	getPaths(){
		this.PathService.getPaths()
			.then((data)=>{
				this.availablePaths = data.paths;
				this.carousel();
				console.log("get path in detail view",this.availablePaths);
			},(error)=>{
				console.log(error);
			})
	}
	carousel(){
		this.currentSlideIndex++;
		if(this.currentSlideIndex >= this.availablePaths.length){
			this.currentSlideIndex = 0;
		}
		this.$timeout(()=>{
			this.carousel();
		}, 3000);
	}
}
PathDetailsController.$inject = ["PathService","$routeParams","$location","$timeout"];