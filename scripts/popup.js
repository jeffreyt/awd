var bg = chrome.extension.getBackgroundPage();

window.onload = function(){
  var willNotify = bg.getWillNotify();
  loadListings(willNotify);

  document.getElementById('clear_all').addEventListener('click',function(){
    bg.clearWillNotify();
    window.close();
  });
  document.getElementById('open_all').addEventListener('click',function(){
    var willNotify = bg.getWillNotify();
    //open all links in separate tabs
    for(i=0;i<willNotify.length;i++){
      chrome.tabs.create({ url: willNotify[i][1]});
    }
    //clear willNotify and clear badge
    bg.clearWillNotify();
    //close window
    window.close();
  });
  document.getElementById('refresh_all').addEventListener('click',function(){
    bg.refreshPages();
    window.close();
  })
  document.getElementById('options').addEventListener('click',function(){
    var optionsUrl = chrome.extension.getURL('options.htm');
    chrome.tabs.query({url: optionsUrl}, function(tabs) {
      if (tabs.length) {
        chrome.tabs.update(tabs[0].id, {active: true});
      }
      else {
        chrome.tabs.create({url: optionsUrl});
      }
    });
  });

  //Open copy/paste window
  document.getElementById('for_copy_paste').addEventListener('click',function(){
    if (!popupWin){
      var popupWin = PopupCenter('cppopup.htm', 'cp_window', 600, 600);
      popupWin.document.write('');
      popupWin.document.write('<h1 style="text-align:center">Copy/Paste</h1><br><textarea id="cp_text_area" rows="35" cols="80"></textarea>');
      var notifyStr = notify2CPText(bg.getWillNotify());
      popupWin.document.getElementById("cp_text_area").value = notifyStr;
    }
  });
  document.getElementById('add_remove').addEventListener('click',function(){
    // Do NOT forget that the method is ASYNCHRONOUS
    chrome.tabs.query({
      active: true,               // Select active tabs
      lastFocusedWindow: true     // In the current window
    }, function(array_of_Tabs) {
      // Since there can only be one active tab in one active window,
      //  the array has only one element
      var tab = array_of_Tabs[0];
      // Example:
      url2AzId(tab.url);
      
    });
  });
}

function loadListings(willNotify){
  var main = $('#main_body');
  if(willNotify.length<1){
    //main.append('<div> No Changes </div>');
    main.append('<p align="center">No Changes</p>')
    main.append('<hr>');
  }
  for(i=0;i<willNotify.length;i++){
    //console.log(willNotify[i]);
    main.append('<div><a href="' +willNotify[i][1]+ '" target="_blank" class = "popup_link" id="ln'+i+'">' +willNotify[i][0]+ '</a> - '+willNotify[i][2][0][0]+' '+willNotify[i][2][0][1]+'</div>');
    //main.append('<div><a href="' +willNotify[i][1]+ '" class = "popup_link" id="ln'+i+'">' +willNotify[i][0]+ '</a> - '+willNotify[i][2][0][0]+' '+willNotify[i][2][0][1]+'</div>');
    main.append('<br><hr>');
  }
  var elements = document.getElementsByClassName('popup_link');
  //console.log(elements.length);
  for (var i = 0; i < elements.length; i++) {
    elements[i].addEventListener('click', (function(i) {
        return function() {
          bg.delWillNotify(i);
        };
    })(i), false);
  }
}

/*
document.addEventListener('DOMContentLoaded', function() {

});
*/
