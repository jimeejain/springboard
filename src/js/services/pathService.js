class PathService{
	constructor($http,$q){
		this.$http = $http;
		this.$q = $q;
		this.pathListResponse = null;
	}

	getPathFromWeb(){
		return this.$http({
			url:"https://hackerearth.0x10.info/api/learning-paths?type=json&query=list_paths",
			//url:"data.json",
			method:"GET"
		})
	}
	getPaths(){
		return this.$q((resolve,reject)=>{
			if(this.pathListResponse){
				resolve(this.pathListResponse);
			}else{
				this.getPathFromWeb()
					.then((response)=>{
						this.pathListResponse = this.processData(response.data);
						resolve(this.pathListResponse);
					},(error)=>{
						reject(error);
					})
			}
		})
	}
	getPath(pathId){
		return this.$q((resolve,reject)=>{
			if(this.pathListResponse){
				resolve(this.findByKey(this.pathListResponse.paths,"id",pathId));
			}else{
				this.getPaths()
					.then((data)=>{
						resolve(this.findByKey(data.paths,"id",pathId));
					},(error)=>{
						reject(error);
					})
			}
		})
	}
	findByKey(arr,key,value){
		for(let i=0,len=arr.length;i<len;i++){
			if(arr[i][key] == value){
				return arr[i];
			}
		}
		return null;
	}
	processData(data){
		data.paths = data.paths.map((u,i,arr)=>{
			u.id = parseInt(u.id);
			u.learner = parseInt(u.learner.replace(/,/g,""));
			u.hours = parseInt(u.hours);
			u.tagsArr = u.tags.split(",")
						.map((u)=>{
							return u.trim();
						}).filter((u)=>{
							return u != "" && u != undefined;
						});
			u.likeCount = this.getLocalStoredLikeCount(u.id)
			return u;
		});
		data.tags = data.paths.reduce((allTags,unitPath)=>{
			unitPath.tagsArr.forEach((unitTag)=>{
				if(allTags.indexOf(unitTag) == -1){
					allTags.push(unitTag);
				}
			});
			return allTags;
		},[])
		return data;
	}
	getLocalStoredLikeCount(id){
		try{
			let likeCount = localStorage.getItem(id);
			return likeCount ? parseInt(likeCount) : 0;
		}catch(Error){
			return 0;
		}
		
	}
	updateLike(id,likeCount){
		try{
			localStorage.setItem("" + id , ""+likeCount)
		}catch(error){
			console.error("localStorage not supported");
		}
	}
}
PathService.$inject = ["$http","$q"];