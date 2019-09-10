export class SearchObjectService {
	//#region From AngularJS
	private static comparator(obj, text): boolean {
		if (obj && text && typeof obj === 'object' && typeof text === 'object') {
			for (var objKey in obj) {
				if (objKey.charAt(0) !== '$' && obj.hasOwnProperty(objKey) &&
					this.comparator(obj[objKey], text[objKey])) {
					return true;
				}
			}
			return false;
		}
		text = ('' + text).toLowerCase();
		return ('' + obj).toLowerCase().indexOf(text) > -1;
	}


	public static search(obj, text): boolean {
		
		// user searching in grid with ability to include AND searches using && as the AND seperator
		if (text.length > 1){
		
			if (text.substr(text.length-2,2) == "&&"){
				text = text.substr(0, text.length-2 );
			}

			if (text.substr(text.length-1,1) === "&"){
				text = text.substr(0, text.length-1 );
			}

			while (text.substr(text.length-1,1) === " "){
				text = text.substr(0, text.length-1 );
			}
		}

		let statusList  = [];
		let textList : string [] = text.split(" && ") ;

		for (let x=0; x < textList.length; x++) {
			statusList.push(false);
		}

		if (typeof text == 'string' && text.charAt(0) === '!') {
			return !SearchObjectService.search(obj, text.substr(1));
		}
		switch (typeof obj) {
			case "boolean":
			case "number":
			case "string":
				return SearchObjectService.comparator(obj, text);
			case "object":
				switch (typeof text) {
					case "object":
						return SearchObjectService.comparator(obj, text);
					default:

						for (var objKey in obj) {
							for (let x=0;x < textList.length ; x++){
								if (!statusList[x]){
									statusList[x] = objKey.charAt(0) !== '$' && SearchObjectService.search(obj[objKey], textList[x]);
								}		
							}
						}
						
						if ( statusList.every( (element) => element == true ) ) {
							return true;
						}
						
						break;
				}
				return false;
			default:
				return false;
		}
	}

	//#endregion

	public static filterEntities(entities: any[], filterText?: string): any[] {
		
		if (filterText === undefined || filterText === null || filterText === '')
			return entities;
		return entities.filter((e) => {			
			return SearchObjectService.search(e, filterText);						
		});
	}
}

// export class SearchObjectService {
// 	//#region From AngularJS
// 	private static comparator(obj, text): boolean {
// 		if (obj && text && typeof obj === 'object' && typeof text === 'object') {
// 			for (var objKey in obj) {
// 				if (objKey.charAt(0) !== '$' && obj.hasOwnProperty(objKey) &&
// 					this.comparator(obj[objKey], text[objKey])) {
// 					return true;
// 				}
// 			}
// 			return false;
// 		}
// 		text = ('' + text).toLowerCase();
// 		return ('' + obj).toLowerCase().indexOf(text) > -1;
// 	}
// 	public static search(obj, text): boolean {
// 		if (typeof text == 'string' && text.charAt(0) === '!') {
// 			return !SearchObjectService.search(obj, text.substr(1));
// 		}
// 		switch (typeof obj) {
// 			case "boolean":
// 			case "number":
// 			case "string":
// 				return SearchObjectService.comparator(obj, text);
// 			case "object":
// 				switch (typeof text) {
// 					case "object":
// 						return SearchObjectService.comparator(obj, text);
// 					default:
// 						for (var objKey in obj) {
// 							if (objKey.charAt(0) !== '$' && SearchObjectService.search(obj[objKey], text)) {
// 								return true;
// 							}
// 						}
// 						break;
// 				}
// 				return false;
// 			default:
// 				return false;
// 		}
// 	}
// 	//#endregion

// 	public static filterEntities(entities: any[], filterText?: string): any[] {
// 		if (filterText === undefined || filterText === null || filterText === '')
// 			return entities;
// 		return entities.filter((e) => {
// 			return SearchObjectService.search(e, filterText);
// 		});
// 	}
// }