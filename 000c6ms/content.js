//alert('content');
(w=>{
	const d=w.document,sheets=d.styleSheets;
	if(0!==sheets.length){
		const pseudoRegExp=/\:\:?(?!not\()?\:?\:?[\w-]+\)?/gi,
		matchMedia=w.matchMedia,
		dE=d.documentElement,
		cascade=[],
		loopRules=obj=>{
			let rules=false;
			try{
				if('cssRules' in obj){
					rules=obj.cssRules
				}
			}catch(exception){
				console.dir({exception,obj})
			}finally{
				if(false!==rules){
					for(const rule of rules){
						const n=rule.type;
						if(4===n){
							if(matchMedia(rule.conditionText).matches){
								loopRules(rule)
							}
						}else{
							if(3!==n){
								cascade.push(rule)
							}
						}
					}
				}
			}
		};
		//
		for(const sheet of sheets){
			if(true!==sheet.disabled){
				const medias=sheet.media;
				if(0!==medias.length){
					for(const media of medias){
						if(matchMedia(media).matches){
							loopRules(sheet);
							break
						}
					}
				}else{
					loopRules(sheet)
				}
			}
		};
		//console.info('cascade:%O',cascade);

		let i=0+cascade.length;
		while(0!==i){
			const rule=cascade[--i];
			if(1===rule.type){
				let selectors=rule.selectorText;
				if(selectors){
					//console.log(selectors);
					selectors=selectors.split(',').filter(selector=>{
						return null!==dE.querySelector(selector)||null!==dE.querySelector(selector.replace(pseudoRegExp,''))
					});
					if(0!==selectors.length){
						//console.log('good:',selectors);
						let s=rule.cssText;
						cascade[i]=selectors.join(',\n')+s.substring(s.indexOf('{'));
					}else{
						cascade[i]=''
					}
				}
			}
		};
		//console.dir(cascade);
		console.log(cascade.join('\n\n'));
	}
})(window);
//
console.timeStamp('sendmessage');
chrome.runtime.sendMessage({
	val:1
});