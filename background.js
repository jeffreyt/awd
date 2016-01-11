
chrome.storage.local.get("interval_time",function(result){
	//set alarm
	createAlarm("time_alarm",result.interval_time);
})

chrome.alarms.onAlarm.addListener(function( alarm ) {
	chrome.storage.local.get("saved_pages",function(result){
		//console.log(result.saved_pages['B01574SORE']['old_price']);
		//console.log(processPages(result.saved_pages)['B01574SORE']['old_price']);
		//myNewSavedPage['B01574SORE']['old_price']=277;
		processPages(result.saved_pages,function(){
			
		});
		//chrome.storage.local.set({'saved_pages': processPages(myNewSavedPage)}, function() {
		//});
		//using stored pages, pass to processPages where pages are parsed, alerts
		//sent out and new data is stored
		//chrome.storage.local.set({'saved_pages': processPages(result.saved_pages)}, function() {
		//});
	});
});

//On Startup
/*
function setBGTime(){
	chrome.storage.local.get("interval_time",function(result){




		document.getElementById("bg_interval_time").value = result.interval_time;
	});
}

setBGTime();
console.log(document.getElementById("bg_interval_time").value);
*/
//get or set options
//

/*


for (i=0;i<url.length;i++){
	$.get(url[i], function(response) {
		returnOffers = getOffers(response);
		console.log(returnOffers[0]);
		if (returnOffers[0]>0){
	    console.log(returnOffers[1]);
		}
		returnOffers = null;
	});
}


*/
