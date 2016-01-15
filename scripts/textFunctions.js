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

  //returnStr = '<div class="single_entry_full>"<p class="amzid_col">'+entry["key"]+'</p><div class="divider"></div><a class="single_entry_ind" href="'+amzId2Url(entry["key"])+'">'+entry["name"]+'</a>';

  returnStr = '<div class="single_entry_full"><p class="single_entry_ind">'+entry["key"]+'</p><div class="divider"></div><a class="single_entry_ind" href="'+amzId2Url(entry["key"])+'">'+entry["name"]+'</a><div class="divider"></div><p class="single_entry_ind">$'+entry["max_price"]+'</p><div class="divider"></div><p class="single_entry_ind">'+entry["last_refresh"]+'</p></div><HR WIDTH="50%" SIZE="3" NOSHADE>'

  return returnStr;




}
