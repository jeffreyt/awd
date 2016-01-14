


var willNotify = [];
var bgOptions;

//***********************On startup******************************//

chrome.storage.local.get("options",function(result){
	if (typeof result === "undefined"){
		bgOptions = {"play_sound":true};
		chrome.storage.local.set({"options":bgOptions});
	}
	else bgOptions = result.options;
});


chrome.storage.local.get("interval_time",function(result){
	//set alarm
	createAlarm("time_alarm",result.interval_time);
});

chrome.alarms.onAlarm.addListener(function( alarm ) {
	chrome.storage.local.get("saved_pages",function(result){
		processPages(result.saved_pages);
		//
	});
});

//*************************************************************//
//*************************************************************//

function getOptions(){
	return bgOptions;
}

function addWillNotify(input){
	//willNotify = input;
	chrome.storage.local.get("notify",function(response){
		if (typeof response.notify === "undefined"){
			willNotify = input;
		}
		else {
			willNotify = mergeArray(input,response.notify);
		}
		chrome.storage.local.set({"notify":willNotify});
	});
}

function getWillNotify(){
	return willNotify;
}

function delWillNotify(index){
	chrome.storage.local.get("notify",function(response){
		willNotify = response.notify;
		willNotify.splice(index,1);
		updateBadge(willNotify.length);
		chrome.storage.local.set({"notify":willNotify});
	});
}

function clearWillNotify(){
	willNotify = [];
	chrome.storage.local.set({"notify":willNotify});
	updateBadge(0);
}

function updateBadge(num){
	if (num > 0){
		chrome.browserAction.setBadgeText({text: num.toString()});
	}
	else{
		chrome.browserAction.setBadgeText({text: ''});
	}
}

//refreshPages
//immediately refresh all pages

function refreshPages(){
	chrome.storage.local.get("saved_pages",function(result){
		processPages(result.saved_pages);
	});
}