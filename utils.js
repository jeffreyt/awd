


function pages2Str(pages){

    var outStr = "";
    for (var key in pages){
        outStr = outStr.concat(key + ',\t' + pages[key]["name"] + ',\t' + pages[key]["price"] + '\n');
    }
    return outStr;
}

//fucntion converts string of input pages format into a dictionary

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
      savedPages[itemStr[0].trim()]["name"] = itemStr[1].trim();
      savedPages[itemStr[0].trim()]["price"] = parseFloat(itemStr[2]);
      savedPages[itemStr[0].trim()]["old_price"] = "";
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
