


var willNotify = [];
var bgOptions = {"play_sound":0};
var savedPages;
var robotCheck=false;


//console.log("label: " + GmailApp.createLabel("FOO"));

//test email


/*
function sendTestEmail(){
	var mailText = constructEmail("mike","TM Email","angel.romeo98@gmail.com","mike.tamashiro@gmail.com","hello","this is a pretty quick test");
	console.log(mailText);
	//testMail();
	sendEmail("me", mailText);
}
*/
//***********************On startup******************************//

chrome.storage.local.get("options",function(response){
	if (typeof response === "undefined"){
		bgOptions = {"play_sound":0};
		chrome.storage.local.set({"options":bgOptions});
	}
	else bgOptions = response.options;
});

chrome.storage.local.get("interval_time",function(result){
	//set alarm
	createAlarm("time_alarm",result.interval_time);
});

chrome.storage.local.get("saved_pages",function(result){
	if (typeof result.saved_pages === "undefined"){
		savedPages = {}
	}
	else{
		savedPages = result.saved_pages;
	}
});


//On alarm

chrome.alarms.onAlarm.addListener(function( alarm ) {
	chrome.storage.local.get("saved_pages",function(result){
		if (typeof result.saved_pages === "undefined"){
			savedPages = {}
		}
		else{
			processPages(result.saved_pages);
			savedPages = result.saved_pages;
		}
	});

});

//*************************************************************//
//*************************************************************//

function getOptions(){
	return bgOptions;
}

function setOptions(response){
	bgOptions = response;
	chrome.storage.local.set({"options":bgOptions});
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

function getSavedPages(){
	return savedPages;
}

function idInSavedPages(amzID){
	if (amzID in savedPages){
		return true;
	}
	else{
		return false;
	}
}

function add2SavedPages(key,title,price, callback){
	savedPages[key] = {};
	savedPages[key]["key"]=key;
	savedPages[key]["name"] = title;
	savedPages[key]["max_price"] = price;
	savedPages[key]["last_refresh"] = "Never";
	savedPages[key]["old_price"] = MAX_PRICE;
	callback();
}

function removeFromSavedPages(key,callback){
	delete savedPages[key];
	callback();
}

function setSavedPages(response,callback){
	savedPages = response;
	callback();
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
		savedPages = result.saved_pages;
		//make sure chrome alarm exists.  if not create one
		chrome.alarms.get("time_alarm",function(response){
			if(response === undefined){
				chrome.storage.local.get("interval_time",function(result){
					createAlarm("time_alarm",result.interval_time);
				});
			}
		});
	});
}

function getRobotCheck(){
	return robotCheck;
}

function setRobotCheck(robot){
	robotCheck = robot;
}
