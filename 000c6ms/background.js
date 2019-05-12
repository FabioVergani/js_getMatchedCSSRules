let StylesheetContentSecurityPolicyEnabled=true,
tabWithDisabledActionId=null;
//
const tabs=chrome.tabs,
runtime=chrome.runtime,
browserAction=chrome.browserAction,
updateIcon=(a,b='')=>{
	const e=browserAction;
	e.setIcon({path:a});
	e.setTitle({title:b+'\nStylesheet CSP:'+(StylesheetContentSecurityPolicyEnabled?'enabled':'disabled')})
};
//
chrome.webRequest.onHeadersReceived.addListener(details=>{
	const headers=details.responseHeaders;
	if(StylesheetContentSecurityPolicyEnabled){
		let i=0+headers.length;
		while(0!==i){
			const header=headers[--i];
			if('content-security-policy'===header.name.toLowerCase()){
				console.warn(header);
				header.value='';
			}
		}
	};
	console.dir(headers);
	return {responseHeaders:headers}
},{
	urls:['<all_urls>'],
	types:['stylesheet']
},[
	'blocking',
	'responseHeaders'
]);
//
runtime.onMessage.addListener((msg,sender)=>{
	console.dir({msg,sender});
	if(runtime.id===sender.id){
		const tabId=tabWithDisabledActionId;
		if(tabId===sender.tab.id && 1===msg.val){
			browserAction.enable(tabId,()=>{
				StylesheetContentSecurityPolicyEnabled=true;
				tabWithDisabledActionId=null;
				updateIcon('19.png')
			})
		}
	}
})
//
browserAction.onClicked.addListener(tab=>{
	if(0!==tab.url.indexOf('chrome://')){
		const tabId=tab.id;
		browserAction.disable(tabId,()=>{
			if(StylesheetContentSecurityPolicyEnabled){
				StylesheetContentSecurityPolicyEnabled=false;
			};
			updateIcon('19-disabled.png','\u22EF');
			tabs.executeScript((tabWithDisabledActionId=tabId),{file:'content.js'})
		})
	}
});