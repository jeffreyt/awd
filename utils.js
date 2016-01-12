MAX_PRICE = 10000.0;


function pages2Str(pages){

    var outStr = "";
    for (var key in pages){
        outStr = outStr.concat(key + ',\t' + pages[key]["name"] + ',\t' + pages[key]["max_price"] + '\n');
    }
    return outStr;
}

//function converts string of input pages format into a dictionary

function str2Pages(response){
  //checking import text
  response = response.trim("\n");

  //operating on input text
  response = response.split("\n");
  var savedPages = {};

  for (i=0;i<response.length;i++){
      itemStr = response[i];
      itemStr = itemStr.split(",");
      savedPages[itemStr[0].trim()] = {}
      savedPages[itemStr[0].trim()]["key"] = itemStr[0].trim();
      savedPages[itemStr[0].trim()]["name"] = itemStr[1].trim();
      savedPages[itemStr[0].trim()]["max_price"] = parseFloat(itemStr[2]);
      savedPages[itemStr[0].trim()]["old_price"] = MAX_PRICE;
  }
  return savedPages;
}

//function converts amazon id into a link and returns url
//
//
function amzId2Url(id){
  var link = "";
  link=link.concat("http://www.amazon.com/gp/offer-listing/");
  link=link.concat(id);
  link=link.concat("/ref=sr_1_1_olp?m=A2L77EE7U53NWQ");
  return(link);
}

//mergeArray

function mergeArray(ar1, ar2) {
  var a;
  //arrays are merged, but duplicates could exist
  a = ar1.concat(ar2);
  //remove duplicates by creating a dictionary with name acting as key
  //and remaining as value
  tempDict = {};
  for(i in a){
    val = a[i];
    key = val.splice(0,1);
    tempDict[key]=val;
  }
  //now recreate array from temporary dictionary
  a = [];
  for(i in tempDict){
    a.push([i,tempDict[i][0],tempDict[i][1]]);
  }
  return a;
}
