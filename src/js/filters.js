angular.module("springboardApp")
.filter("tagFilter",()=>{
	return (inputPaths,filterTags)=>{
		if(filterTags == undefined || filterTags.length == 0){return inputPaths;}
		return inputPaths.filter((unitPath)=>{
			let tags = unitPath.tagsArr;
			for(let i=0,len=tags.length;i<len;i++){
				if(~filterTags.indexOf(tags[i])){return true;}
			}
			return false;
		})
	}
})
.filter("tagSearch",()=>{
	return (inputTags,query)=>{
		query = query.toLowerCase();
		return inputTags.filter((unit)=>{
			return ~unit.toLowerCase().indexOf(query);
		})
	}
})
.filter("searchFilter",()=>{
	return (inputPaths,query)=>{
		if(!query){	return inputPaths;}
		query = query.trim().toLowerCase();
		return inputPaths.filter((unit)=>{
			return (
					~unit.name.toLowerCase().indexOf(query) ||
					~unit.description.toLowerCase().indexOf(query) ||
					~unit.tags.toLowerCase().indexOf(query)
				)
		})
	}
})
.filter("orderFilter",()=>{
	return (inputPaths,orderKey,isAsc)=>{
		let isNumber = false;
		let numberKeys = ["id","learner",'hours'];
		if(~numberKeys.indexOf(orderKey)){
			isNumber = true;
		}
		let sortedPath  = [];
		
		inputPaths.sort((a,b)=>{
			a = a[orderKey];
			b = b[orderKey];
			if(isNumber){
				if(isAsc){
					return a-b;
				}else{
					return b-a;
				}
			}else{
				if(isAsc){
					return a.localeCompare(b);
				}else{
					return b.localeCompare(a);
				}
			}
		});
		return inputPaths;
	}
})