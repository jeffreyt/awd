
//constants
DIV_NAME = 'a-row a-spacing-mini olpOffer'
DIV_TRADE_NAME = ''
PRICE_NAME = 'a-size-large a-color-price olpOfferPrice a-text-bold'
CONDITION_NAME = 'a-size-medium olpCondition a-text-bold'
DESCRIPTION_NAME = 'comments'
DEFAULT_CHECKTIME = 180.0;


function processPages(savedPages,resultPages){
  var toNotify = [];
  var count = Object.keys(savedPages).length;
  for (i in savedPages){
    (function(keys){
      var urlStr = amzId2Url(i);
      getData(urlStr,function(err,data){
        //console.log(data);
        count--;
        //toNotify.push(processHTML(data,i,savedPages));
        console.log(processHTML(data,i,savedPages));
        if (count < 1){
          //console.log(toNotify);
        }
      });
    })(i);
    //notice = processHTML(htmlStr);
  }
  function getData(url,callback){
    $.get(url,function(result){
      //console.log(result);
      callback(null,result)
    });
  };

}

function processHTML(htmlStr,key,savedPages){
  newSavedPages = savedPages;
  returnOffers = getOffers(htmlStr);
  var name = savedPages[key]['name'];
  var maxPrice = savedPages[key]['max_price'];
  var oldPrice = savedPages[key]['old_price'];
  //console.log(oldPrice);
  //if there are any offers, check against max price
  if (returnOffers[0]>0){
    //console.log(name);
    //console.log(parseFloat(returnOffers[1][0][0].replace('$','')));
    lowestPrice = parseFloat(returnOffers[1][0][0].replace('$',''));
    if (lowestPrice <= maxPrice & lowestPrice < oldPrice){
      //item meets price criteria.  alert user
      console.log('alert for lowest price sucka');
    }
  }
  else{
    lowestPrice = MAX_PRICE;
  }
  //re-save oldPrice
  newSavedPages[key]["old_price"] = lowestPrice;
  notice = [savedPages[key],lowestPrice, returnOffers];
  //console.log(newSavedPages[key])
  //cleaning up
  returnOffers = null;
  urlStr = null;
  //re-save newSavedPages
  //console.log(notice);
  return notice;
}

//getOffers
//description:
//input: html (str)
//output: number of offers (int), offers (dictionary)

function getOffers(response){
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
	       var description = offers[j].getElementsByClassName(DESCRIPTION_NAME)[0].innerText.replace(/\r?\n|\r/g, '').trim().replace(/\s+/g, ' ');
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
    var tradeVal = el.getElementsByClassName(DIV_TRADE_NAME);
}


//Options Functions

//importPages
//description:
//input:
//output:

function importPages(response){

  savedPages = str2Pages(response);
  console.log(savedPages);
  chrome.storage.local.set({'saved_pages': savedPages}, function() {
      // Notify that we saved.
      alert('Data Successfully Saved');
  });
}

function exportPages(){
  var varName = 'saved_pages';
  chrome.storage.local.get(varName,function(result){
      document.getElementById("text_area").value = pages2Str(result.saved_pages);
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

function fireNotification(){
  var opt = {type: "basic",title: "Your Title",message: "Your message",iconUrl: "icon.png"}
  chrome.notifications.create("notificationName",opt,function(){});

}
