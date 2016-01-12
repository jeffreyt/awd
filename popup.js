var bg = chrome.extension.getBackgroundPage();

window.onload = function(){
  var willNotify = bg.getWillNotify();
  loadListings(willNotify);

  document.getElementById('clear_all').addEventListener('click',function(){
    bg.clearWillNotify();
    window.close();
  });
  document.getElementById('check_all').addEventListener('click',function(){
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
}

function loadListings(willNotify){
  console.log(willNotify);
  var main = $('#main_body');
  if(willNotify.length<1){
    main.append('<div> No Changes </div>');
    main.append('<br><hr>');
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
