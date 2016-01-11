
function processPagesPin(savedPages){

  newSavedPages = savedPages;
  var toNotify = [];
  //console.log(savedPages);
  //console.log(savedPages['B01574SORE']);
  for (var i in savedPages){
    (function(key){
      var urlStr = amzId2Url(key);
      var getNotice = $.get(urlStr, function(response) {
        notice = processHTML(response,key,savedPages);
      });
    })(i);
  }
  return newSavedPages;
}


function processPagesPinPin(savedPages){

/*
  var arr = ['Hello', 'World', 'Javascript', 'Async', ':)'];
  for( var i = 0; i < arr.length; i++) {
    (function(index){
      setTimeout(function(){
        console.log(index);
        console.log(arr[index]);
      }, 500);
    })(i);
  }*/

  newSavedPages = savedPages;
  var toNotify = [];
  //console.log(savedPages);
  //console.log(savedPages['B01574SORE']);
  for (var i in savedPages){
    (function(key){
      var urlStr = amzId2Url(key);
    //need to put (function(key)
      $.get(urlStr, function(response) {
        returnOffers = getOffers(response);
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
        notice = [name,lowestPrice];
        //console.log(newSavedPages[key])
        //cleaning up
        returnOffers = null;
        urlStr = null;
        //re-save newSavedPages
        return notice;
      }).done(function(notice){
        console.log(notice);
      });
    })(i);
  }
  return newSavedPages;
}
