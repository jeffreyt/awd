
//constants
DIV_NAME = 'a-row a-spacing-mini olpOffer'
DIV_TRADE_NAME = 'tradeInButton_tradeInValue'
PRICE_NAME = 'a-size-large a-color-price olpOfferPrice a-text-bold'
CONDITION_NAME = 'a-size-medium olpCondition a-text-bold'
DESCRIPTION_NAME = 'comments'
DEFAULT_CHECKTIME = 30.0;
LISTING_LIMIT = 4;
MINS2MS = 60000

debug = false;

//Core Function
//process pages

function processPages(savedPages){
  var toNotify = [];
  if (typeof savedPages === "undefined") savedPages = {};
  var count = Object.keys(savedPages).length;

  for (i in savedPages){
    (function(key){
      var urlStr = amzId2Url(key);
      if(!getRobotCheck()){
        getData(urlStr,function(err,data){
          //console.log(data);
          count--;
          if (count>-1){
            tempPages = processHTML(data,key,savedPages);
            if (tempPages[0]){
              toNotify.push(tempPages[1]);
              //console.log(processHTML(data,key,savedPages));
              if (count < 1){
                //processNotify will be called after all pages are retrieved
                processNotify(toNotify,savedPages);
                //console.log(toNotify);
              }
            }
            else{
              //robot check went off kill everything
              console.log(key);
              killAllAlert(amzId2Url(key));
              count=-1;
            }
          }
        });
      }
    })(i);
  }
}

function getData(url,callback){
  $.get(url,function(result){
    callback(null,result);
  });
}

function processHTML(htmlStr,key,savedPages){
  var notify = false;
  returnOffers = getOffers(htmlStr);
  if (returnOffers[0]<0){
    //robot check went off, return false
    return [false,amzId2Url(key)];
  }
  var name = savedPages[key]['name'];
  var maxPrice = savedPages[key]['max_price'];
  var oldPrice = savedPages[key]['old_price'];
  //console.log(oldPrice);
  //if there are any offers, check against max price
  if (returnOffers[0]>0){
    lowestPrice = parseFloat(returnOffers[1][0][0].replace('$',''));
    if (lowestPrice <= maxPrice & lowestPrice < oldPrice){
      //item meets price criteria.  alert user
      notify = true;
    }
  }
  else{
    lowestPrice = MAX_PRICE;
  }
  //re-save oldPrice
  notice = [savedPages[key],lowestPrice, returnOffers, notify];
  //cleaning up
  returnOffers = null;
  urlStr = null;
  //re-save newSavedPages
  return [true,notice];
}

function processNotify(toNotify, savedPages){
  //step through

  var willNotify = [];
  for(i=0;i<toNotify.length;i++){
    //modify savedPages
    savedPages[toNotify[i][0]["key"]]["old_price"]=toNotify[i][1];

    //build willNotify array
    if (toNotify[i][3]){
      //name
      //link
      //first few (limit in static vars) listings
      vals = [toNotify[i][0]["name"],amzId2Url(toNotify[i][0]["key"])];
      if (toNotify[i][2][0]>LISTING_LIMIT){
        tempLists = toNotify[i][2][1].slice(0,4);
      }
      else tempLists = toNotify[i][2][1];
      vals.push(tempLists);
      willNotify.push(vals);
    }
  }
  savedPages = updateTime(savedPages);
  if(!debug){
    chrome.storage.local.set({"saved_pages":savedPages},function(){
    });
  }

  //steps for notifying
  //1. possible text message/email
  //2. notification
  addWillNotify(willNotify);

  if (willNotify.length>0){
    //sendEmailText(willNotify);
    fireNotification(willNotify);
  }
}

//getOffers
//description:
//input: html (str)
//output: number of offers (int), offers (dictionary)

function getOffers(response){

    var bot = response.search("Robot Check");
    if(bot > -1){
      //robot check went off.  kill everything
      return [-1,null];
      setRobotCheck(true);
    }

    var el = document.createElement( 'html' );
    el.innerHTML = response;
    var offers = el.getElementsByClassName(DIV_NAME);


    if (offers.length > 0){
	   var allOffers = []
	   for (j=0;j<offers.length;j++){
	       var indArr = []
	       //console.log(offers[j]);
	       var price = offers[j].getElementsByClassName(PRICE_NAME)[0].innerText.trim();
	       var condition = offers[j].getElementsByClassName(CONDITION_NAME)[0].innerText.replace(/\r?\n|\r/g, '').trim().replace(/\s+/g, ' ');
         condition = condition.replace("Used - ","");
         condition = condition.replace("Acceptable","(A)");
         condition = condition.replace("Very Good","(VG)");
         condition = condition.replace("Good","(G)");
         condition = condition.replace("Like New","(LN)");
         try {
           var description = offers[j].getElementsByClassName(DESCRIPTION_NAME)[0].innerText.replace(/\r?\n|\r/g, '').trim().replace(/\s+/g, ' ');

         }
         catch(err) {
           var description = 'no description';
         }
         if (description.indexOf('\u00AB') > -1) {description = description.substring(0,description.indexOf('\u00AB'));}
	       indArr.push(price);
	       indArr.push(condition);
	       indArr.push(description);

	       allOffers.push(indArr);
        }
    }
    return [offers.length, allOffers];
}

//getTradeIn
//description:
//input:
//output:

function getTradeIn(response){
    var el = document.createElement( 'html' );
    el.innerHTML = response;
    var tradeVal = el.getElementById(DIV_TRADE_NAME).innerHTML;
    console.log(tradeVal);
}


//Options Functions

//importPages
//description:
//input:
//output:

function importPages(response){
  console.log('got here');
  var bg = chrome.extension.getBackgroundPage();
  savedPages = str2Pages(response);
  bg.setSavedPages(savedPages,function(){
    chrome.storage.local.set({'saved_pages': savedPages}, function() {
        // Notify that we saved.
        alert('Data Successfully Saved');
    });
  });
}

function exportPages(){
  var varName = 'saved_pages';
  chrome.storage.local.get(varName,function(result){
    document.getElementById("import_export_text").value = pages2Str(result.saved_pages);
  });
}

//Alarms

function createAlarm(alarmName,alarmInterval) {
	chrome.alarms.create(alarmName, {
		delayInMinutes: 0.0, periodInMinutes: alarmInterval
	});
}

function cancelAlarm(alarmName){
  chrome.alarms.clear(alarmName);
}

//Notifications

function fireNotification(willNotify){
  if (willNotify.length>1){
    myTitle = "Deals Found"
  }
  else myTitle = "Deal Found";
  msg = '';
  for(i=0;i<willNotify.length;i++){
    msg = msg+willNotify[i][0]+', '+willNotify[i][2][0][0]+' '+willNotify[i][2][0][1]+' ('+willNotify[i][2].length+' offers)\n'
  }
  var opt = {type: "basic",title: myTitle ,message: msg, buttons: [{
        title: "Open All Pages",
        iconUrl: "imgs/icon.png"
    },
    {
        title: "Dismiss",
        iconUrl: "imgs/icon.png"
    }], iconUrl: "imgs/icon.png"
  }

  //change here for different notification popup


  chrome.notifications.create("notificationName",opt,function(){
    var bg = chrome.extension.getBackgroundPage();
    var bgOptions = bg.getOptions();
    if (typeof bgOptions === "undefined"){
      bgOptions = {"play_sound":0};
    }
    if (bgOptions["play_sound"]==1){
      var audio = new Audio('audio/cuckoo.ogg');
      audio.play();
    }
    if (bgOptions["play_sound"]==2){
      var audio = new Audio('audio/bell.ogg');
      audio.play();
    }
    setTimeout(function(){
      chrome.notifications.clear("notificationName", function(){})
    }, 10000);
  });
  updateBadge(willNotify.length);
}

chrome.notifications.onButtonClicked.addListener(function(notifId, btnIdx) {
  if (btnIdx === 0) {
    for(i=0;i<willNotify.length;i++){
      chrome.tabs.create({ url: willNotify[i][1]});
    }
    //clear willNotify and clear badge
    clearWillNotify();
    chrome.notifications.clear("notificationName");
  } else if (btnIdx === 1) {
    chrome.notifications.clear("notificationName");
  }
});

function killAllAlert(tempPages){
  chrome.alarms.clear("time_alarm");
  var opt = {type: "basic",title: 'ROBOT CHECK' ,message: 'Robot check went off.  Checking has been suspended until you manually refresh.  Please solve the captcha then refresh.',iconUrl: "imgs/icon.png"}
  chrome.notifications.create("notificationName",opt,function(){
    var popupWin = PopupCenter(tempPages, 'cp_window', 600, 600);
  });
  chrome.notifications.onClicked.addListener(function(){
    chrome.tabs.create({ url: tempPages });
  })
}
