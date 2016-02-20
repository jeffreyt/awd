
var bg = chrome.extension.getBackgroundPage();


/*
chrome.alarms.onAlarm.addListener(function(alarm) {
  refreshOptionsPage();
});

window.onbeforeunload = function () {
    chrome.alarms.clear("opts_refresh");
}

chrome.alarms.create("opts_refresh", {
  delayInMinutes: 0.0, periodInMinutes: 0.08
});
*/
setInterval(function(){
  refreshOptionsPage();
}, 3000);

window.onload = function(){

  //get options
  /*
  var bg = chrome.extension.getBackgroundPage();
  var opts = bg.getOptions();
  console.log(opts);
  */
  //loading saved options
  var manifest = chrome.runtime.getManifest();
  document.getElementById("version_num").innerHTML='ver '+manifest.version;
  //console.log(manifest.name);
  //console.log(manifest.version);

  refreshOptionsPage();

  chrome.storage.local.get("interval_time",function(result){
    //if saved options dont exist use defaults and save
    if (typeof result.interval_time == 'undefined'){
      document.getElementById("check_time").value = DEFAULT_CHECKTIME;
      document.getElementById("check_time_slider").value = DEFAULT_CHECKTIME;
      chrome.storage.local.set({"interval_time":DEFAULT_CHECKTIME},function(){
      });
    }
    else{
      document.getElementById("check_time").value = result.interval_time;
      document.getElementById("check_time_slider").value = result.interval_time;
    }
  });

  document.getElementById("refresh_button").addEventListener('click',function(){
    bg.refreshPages();
  })

  document.getElementById("import_export_button").addEventListener('click',function(){
    $('#import_export_popup').fadeToggle("fast",function(){
      //refreshOptionsPage();
    });
    $('#screen_disable').fadeToggle("fast",function(){

    });

  });

  document.getElementById("import_export_close").addEventListener('click',function(){
    $('#import_export_popup').fadeToggle("fast",function(){

    });
    $('#screen_disable').fadeToggle("fast",function(){

    });
  });

  document.getElementById("import_perform").addEventListener('click',function(){
      var importText = document.getElementById("import_export_text").value
      importPages(importText);
      refreshOptionsPage();
      $('#import_export_popup').fadeToggle("fast",function(){

      });
      $('#screen_disable').fadeToggle("fast",function(){

      });
  });
  //export button
  document.getElementById("export_perform").addEventListener('click',function(){
      document.getElementById("import_export_text").value = "";
      exportPages();
  });
  //time box

  document.getElementById("check_time").addEventListener("keyup",function(){
    document.getElementById("check_time_slider").value = document.getElementById("check_time").value;
  })

  //save slider
  document.getElementById("check_time_slider").addEventListener("change",function(){
      document.getElementById("check_time").value = document.getElementById("check_time_slider").value;
  })
  //save button
  document.getElementById("save_options").addEventListener("click",function(){
    //var bg =

    //get options to save
    var intervalTime = parseFloat(document.getElementById("check_time").value);
    //createAlarm("time_alarm",intervalTime);
    //possible more variables here
    //save options
    console.log(intervalTime);
    chrome.storage.local.set({"interval_time":intervalTime},function(){
      alert('New interval time has been saved.')
      document.getElementById("check_time_slider").value = intervalTime;
      chrome.alarms.create("time_alarm",{
        delayInMinutes: 1.0, periodInMinutes: intervalTime
      });
    });

  });
  //reset old prices
  document.getElementById("reset_old_prices").addEventListener("click",function(){
    chrome.storage.local.get("saved_pages",function(response){

      for(i in response.saved_pages){
        response.saved_pages[i]["old_price"]=MAX_PRICE;
      }
      chrome.storage.local.set({"saved_pages":response.saved_pages},function(){
        alert('Old Prices Have Been Reset');
      });
    })
  });
  var sel = document.getElementById('alert_sound');
  sel.onchange = function(){
    bg.setOptions({"play_sound":sel.value});
  }

  //save edit
  document.getElementById("edit_save").addEventListener("click",function(){

    var savedPages = bg.getSavedPages();
    savedPages[$('#edit_id').html()]["name"] = $('#edit_name').val();
    savedPages[$('#edit_id').html()]["max_price"] = parseFloat($('#edit_price').val());
    bg.setSavedPages(savedPages,function(){
      chrome.storage.local.set({"saved_pages":savedPages});
    });
    $('#edit_popup').fadeToggle("fast",function(){
      refreshOptionsPage();
      $('#edit_id').html('');
      $('#edit_name').val('');
      $('#edit_price').val('');
    });
    $('#screen_disable').fadeToggle("fast",function(){
    });
  });

  //remove edit
  document.getElementById("edit_remove").addEventListener("click",function(){
    bg.removeFromSavedPages($('#edit_id').html(),function(){
      chrome.storage.local.set({"saved_pages":bg.getSavedPages()});
    });
    $('#edit_popup').fadeToggle("fast",function(){
      refreshOptionsPage();
      $('#edit_id').html('');
      $('#edit_name').val('');
      $('#edit_price').val('');
    });
    $('#screen_disable').fadeToggle("fast",function(){
    });
  });

  //close edit
  document.getElementById("edit_cancel").addEventListener("click",function(){
    $('#edit_id').html('');
    $('#edit_name').val('');
    $('#edit_price').val('');
    $('#edit_popup').fadeToggle("fast",function(){
      refreshOptionsPage();
    });
    $('#screen_disable').fadeToggle("fast",function(){
    });
  });
  //test email
  /*
  document.getElementById("test_email").addEventListener("click",function(){
    bg.sendTestEmail();
  });
  */

}

function refreshOptionsPage(){
  //var bg = chrome.extension.getBackgroundPage();

  //set sound drop down
  var bgOptions = bg.getOptions();
  if (typeof bgOptions === "undefined"){
    bgOptions = {};
    bgOptions["play_sound"]=0;
  }
  document.getElementById("alert_sound").value = bgOptions["play_sound"];

  savedPages = bg.getSavedPages();
  var title = $('#monitored_pages_title');
  var lastChecked = $('#monitored_pages_last');
  //var nextCheck = $('#monitored_pages_next');
  var monitoredPages = $('#monitored_pages');
  title.empty();
  lastChecked.empty();
  //nextCheck.empty();
  monitoredPages.empty();

  if(savedPages === undefined || Object.keys(savedPages).length < 1){
    title.append(getOptsTitle(false,0));
  }
  else {
    title.append(getOptsTitle(true,Object.keys(savedPages).length));
    monitoredPages.append('<table id="pages_table"></table>')
    var table = document.getElementById("pages_table");
    //create header
    var header = table.createTHead();
    var row = header.insertRow(0);
    row.style.fontWeight="bold";
    row.style.fontSize="20px";
    var id_cell = row.insertCell(0);
    var name_cell = row.insertCell(1);
    var curr_cell = row.insertCell(2);
    var price_cell = row.insertCell(3);
    var time_cell = row.insertCell(4);

    //id_cell.style.fontWeight="bold";
    id_cell.innerHTML = 'Amazon ID';
    name_cell.innerHTML = 'Name/Link';
    curr_cell.innerHTML = 'Current Price';
    price_cell.innerHTML = 'Max Price';
    time_cell.innerHTML = 'Options';

    //sorting array by name instead of amazon id
    var sortable = [];
    for (var i in savedPages) sortable.push([savedPages[i]["name"], savedPages[i]])
    sortable.sort(function(a, b) {
      return a[0].localeCompare(b[0]);
    });
    savedPages = sortable;
    lastChecked.append('Last Checked: '+savedPages[0][1]["last_refresh"]);



    //nextCheck.append('Next Check: '+'sometime')



    //console.log(sortable.sort(function(a, b) {return a[0] - b[0]}))
    for (i in savedPages){
      var row = table.insertRow(-1);
      var id_cell = row.insertCell(0);
      var name_cell = row.insertCell(1);
      var curr_cell = row.insertCell(2);
      var price_cell = row.insertCell(3);
      var time_cell = row.insertCell(4);

      id_cell.innerHTML = savedPages[i][1]["key"];
      name_cell.innerHTML = '<a target="_blank" href="'+amzId2Url(savedPages[i][1]["key"])+'">'+savedPages[i][1]["name"]+'</a>';
      if (savedPages[i][1]["old_price"]>MAX_PRICE-1){
        currPrice = 'N/A';
      }
      else{
        currPrice = '$'+savedPages[i][1]["old_price"];
      }
      curr_cell.innerHTML = currPrice;
      price_cell.innerHTML = '$'+savedPages[i][1]["max_price"];
      var btn = document.createElement('input');
      btn.type = "button";
      btn.className = "opts_edit_button";
      btn.id = "edit_button_"+savedPages[i][1]["key"];
      btn.value = "Edit";
      time_cell.appendChild(btn);

      //time_cell.innerHTML = savedPages[i][1]["last_refresh"];
      //console.log(getOptsEntry(savedPages[i]));
      //monitoredPages.append(getOptsEntry(savedPages[i]));
    }
    //enable functionality for edit buttons
    var editButtons = document.getElementsByClassName("opts_edit_button");
    var editOnClick = function() {
      var attribute = this.getAttribute("id");
      var savedPages = bg.getSavedPages();
      var key = attribute.slice(12,attribute.length);

      $('#edit_popup').fadeToggle("fast",function(){
        //populate fields with attribute

        $('#edit_id').html(savedPages[key]["key"]);
        $('#edit_name').val(savedPages[key]["name"]);
        $('#edit_price').val(savedPages[key]["max_price"]);

      });
      $('#screen_disable').fadeToggle("fast",function(){

      });
    };
    for (var i = 0; i < editButtons.length; i++) {
      editButtons[i].addEventListener('click', editOnClick, false);
    }
  }
}
