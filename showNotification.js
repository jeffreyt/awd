

function populateNotification(willNotify){
  var main = $('#main_body');

  for(var a in willNotify){
    main.append('<div><a href="' +a[1]+ '">' +a[0]+ '</a></div>');
    //<div><a href="http:.....">Name</a></div>
  }
}
