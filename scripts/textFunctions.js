//Place to put clumsy functions that write out a lot of text

function getOptsTitle(num,count){
  var returnStr;
  if(!num){
    returnStr = '<h2 class="opts_mon_title">No Monitored Pages</h2>';
  }
  else if(count == 1){
    returnStr = '<h2 class="opts_mon_title">'+count+' Monitored Page</h2>';
  }
  else{
    returnStr = '<h2 class="opts_mon_title">'+count+' Monitored Pages</h2>';
  }
  return returnStr;
}

function getOptsEntry(entry){
  var returnStr;
  returnStr = '<tr class="single_entry_row"><td>'+entry["key"]+'</td><td><a href="'+amzId2Url(entry["key"])+'">'+entry["name"]+'</a></td><td>$'+entry["max_price"]+'</td><td>'+entry["last_refresh"]+'</td></tr>'
  return returnStr;
}
