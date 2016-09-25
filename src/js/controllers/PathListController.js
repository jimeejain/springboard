class PathListController{
	constructor(PathService,$location){
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
	getPaths(){
		this.PathService.getPaths()
			.then((data)=>{
				this.availablePaths = data.paths;
				this.tags = data.tags;
				this.quoteAvailable = data.quote_available;
				this.quoteMax = data.quote_max;
				console.log(data);
			},(error)=>{
				console.log(error);
			})
	}
	showDetails(pathId){
		this.$location.path("/path/" + pathId);
	}
	likeDislike(pathObj,isLike=true){
		if(isLike){
			pathObj.likeCount = pathObj.likeCount + 1;
		}else{
			pathObj.likeCount = pathObj.likeCount - 1;
		}
		this.PathService.updateLike(pathObj.id,pathObj.likeCount)
	}
	clearTags(){
		this.filterTags = [];
	}
	addFilterTags(tag){
		let tagIndex = this.filterTags.indexOf(tag);
		if(tagIndex == -1){
			this.filterTags.push(tag);	
		}else{
			this.filterTags.splice(tagIndex,1);
		}
		
	}
	setOrder(key){
		if(this.orderByKey == key){
			this.orderByAsc = !this.orderByAsc;
		}else{
			this.orderByKey = key;
			this.orderByAsc = true;
		}
	}
}
PathListController.$inject = ["PathService","$location"];