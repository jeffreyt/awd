MAX_PRICE = 10000.0;
MONTHS={0:"Jan",
        1:"Feb",
        2:"Mar",
        3:"Apr",
        4:"May",
        5:"Jun",
        6:"Jul",
        7:"Aug",
        8:"Sept",
        9:"Oct",
        10:"Nov",
        11:"Dec"
}


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
  if (response.length<1){
    return {};
  }
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
      savedPages[itemStr[0].trim()]["last_refresh"] = "Never";
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

function PopupCenter(url, title, w, h) {
    // Fixes dual-screen position                         Most browsers      Firefox
    var dualScreenLeft = window.screenLeft != undefined ? window.screenLeft : screen.left;
    var dualScreenTop = window.screenTop != undefined ? window.screenTop : screen.top;

    width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
    height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;

    var left = ((width / 2) - (w / 2)) + dualScreenLeft;
    var top = ((height / 2) - (h / 2)) + dualScreenTop;
    var newWindow = window.open(url, title, 'scrollbars=yes, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left);

    // Puts focus on the newWindow
    if (window.focus) {
        newWindow.focus();
    }
    return newWindow;
}

function notify2CPText(willNotify){
  var notifyStr = '';
  for(i in willNotify){
    notifyStr = notifyStr.concat(willNotify[i][0] + ' - '+willNotify[i][1]+'\n');
    for(j in willNotify[i][2]){
      notifyStr = notifyStr.concat('- '+willNotify[i][2][j][0] + ' '+ willNotify[i][2][j][1]+' '+willNotify[i][2][j][2]+'\n')
    }
    notifyStr = notifyStr.concat('\n\n');
  }
  console.log(notifyStr);
  return notifyStr;
}

//updateTime

function updateTime(savedPages){
  var d = new Date();
  var newD = MONTHS[d.getMonth()]+' '+d.getDate()+', '+d.getHours()+':'+twoDigit(d.getMinutes())+':'+twoDigit(d.getSeconds());
  for(i in savedPages){
    savedPages[i]["last_refresh"]=newD;
  }
  return savedPages;
}

function twoDigit(number) {
  var twodigit = number >= 10 ? number : "0"+number.toString();
  return twodigit;
}

function url2AzId(url){
  spUrl=url.split("/");
  possibleID = []
  for(i in spUrl){
    if(spUrl[i].length==10){
      possibleID.push(spUrl[i]);
    }
  }
  if (possibleID.length==1){
    return [true,possibleID[0]];
  }
  if (possibleID.length>1){
    //do greater than 1 stuff
    return[false,null];
  }
  if (possibleID.length<1){
    //do less than 1 stuff
    return [false,null];
  }
}
