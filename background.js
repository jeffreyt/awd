

chrome.storage.local.get("interval_time",function(result){
	//set alarm
	createAlarm("time_alarm",result.interval_time);
})

chrome.alarms.onAlarm.addListener(function( alarm ) {
	chrome.storage.local.get("saved_pages",function(result){
		newResult = result.saved_pages;
		//step through saved pages
		for (var key in result.saved_pages){
			var urlStr = amzId2Url(key);
			//get html of page and pass to getOffers
			$.get(urlStr, function(response) {
				returnOffers = getOffers(response);
				//if there are any offers, check against last price and max price
				if (returnOffers[0]>0){
				  console.log(parseFloat(returnOffers[1][0][0].replace('$','')));
					newResult[key]["old_price"] = parseFloat(returnOffers[1][0][0].replace('$',''));
					//if result.saved_pages




				}
				returnOffers = null;
			});
		}
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
