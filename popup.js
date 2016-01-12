

window.onload = function(){
    var bg = chrome.extension.getBackgroundPage();
    var willNotify = bg.getWillNotify();
    loadListings(willNotify);
}

function loadListings(willNotify){
  var main = $('#main_body');
  console.log(willNotify);
  for(i=0;i<willNotify.length;i++){
    console.log(i);
    main.append('<div><a href="' +i[1]+ '">' +i[0]+ '</a></div>');
  }
}
