//Place to put clumsy functions that write out a lot of text

function getOptsTitle(num){
  var returnStr;
  if(!num){
    returnStr = '<h2 class="opts_mon_title">No Monitored Pages</h2>';
  }
  else {
    returnStr = '<h2 class="opts_mon_title">Monitored Pages</h2>';
  }

  return returnStr;
}


function getOptsEntry(entry){
  var returnStr;

  returnStr = '<div class="single_entry"><p>'+entry["key"]+'</p><a href="'+amzId2Url(entry["key"])+'>'+entry["name"]+'</a><p>$'+entry["max_price"]+'</p><p>'+entry["last_refresh"]+'</p>'

  return returnStr;




}
