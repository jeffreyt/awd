

window.onload = function(){
    var bg = chrome.extension.getBackgroundPage();
    var willNotify = bg.getWillNotify();
    loadListings(willNotify);
}

function loadListings(willNotify){
  var main = $('#main_body');
  console.log(willNotify);
  for(i=0;i<willNotify.length;i++){
    console.log(willNotify[i]);
    main.append('<div><a href="' +willNotify[i][1]+ '" target="_blank">' +willNotify[i][0]+ '</a></div>');
    main.append('<br><hr>');
  }
}
