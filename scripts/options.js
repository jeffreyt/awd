
var bg = chrome.extension.getBackgroundPage();

window.onload = function(){
  //get options
  /*
  var bg = chrome.extension.getBackgroundPage();
  var opts = bg.getOptions();
  console.log(opts);
  */
  //loading saved options
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

  document.getElementById("import_export_button").addEventListener('click',function(){
    $('#import_export_popup').fadeToggle("fast",function(){

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
  });
  //export button
  document.getElementById("export_perform").addEventListener('click',function(){
      document.getElementById("import_export_text").value = "";
      exportPages();
  });
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

    chrome.storage.local.set({"interval_time":intervalTime},function(){
      alert('New interval time has been saved.')
      document.getElementById("check_time_slider").value = intervalTime;
      setTimeout(function(){
        chrome.alarms.set("time_alarm",intervalTime);
      },intervalTime*MINS2MS);
     })

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
}

function refreshOptionsPage(){
  //var bg = chrome.extension.getBackgroundPage();

  //set sound drop down
  bgOptions = bg.getOptions();
  document.getElementById("alert_sound").value = bgOptions["play_sound"];

  savedPages = bg.getSavedPages();
  var title = $('#monitored_pages_title');
  if(savedPages === undefined || Object.keys(savedPages).length < 1){
    title.append(getOptsTitle(false));
  }
  else {
    title.append(getOptsTitle(true));
    var monitoredPages = $('#monitored_pages');
    //monitoredPages.append('<div class="single_entry_full"><p class="single_entry_ind">Amazon ID</p><div class="divider"></div><p class="single_entry_ind">Name</p><div class="divider"></div><p class="single_entry_ind">Max Price</p><div class="divider"></div><p class="single_entry_ind">Last Refresh</p></div><HR WIDTH="50%" SIZE="3" NOSHADE>')
    var table = document.getElementById("pages_table");
    //create header
    var header = table.createTHead();
    var row = header.insertRow(0);
    row.style.fontWeight="bold";
    row.style.fontSize="20px";
    var id_cell = row.insertCell(0);
    var name_cell = row.insertCell(1);
    var price_cell = row.insertCell(2);
    var time_cell = row.insertCell(3);

    //id_cell.style.fontWeight="bold";
    id_cell.innerHTML = 'Amazon ID';
    name_cell.innerHTML = 'Name/Link';
    price_cell.innerHTML = 'Max Price';
    time_cell.innerHTML = 'Last Checked';

    //sorting array by name instead of amazon id
    var sortable = [];
    for (var i in savedPages) sortable.push([savedPages[i]["name"], savedPages[i]])
    sortable.sort(function(a, b) {
      return a[0].localeCompare(b[0]);
    });
    savedPages = sortable;
    //console.log(sortable.sort(function(a, b) {return a[0] - b[0]}))
    for (i in savedPages){
      var row = table.insertRow(-1);
      var id_cell = row.insertCell(0);
      var name_cell = row.insertCell(1);
      var price_cell = row.insertCell(2);
      var time_cell = row.insertCell(3);

      id_cell.innerHTML = savedPages[i][1]["key"];
      name_cell.innerHTML = '<a href="'+amzId2Url(savedPages[i][1]["key"])+'">'+savedPages[i][1]["name"]+'</a>';
      price_cell.innerHTML = '$'+savedPages[i][1]["max_price"];
      time_cell.innerHTML = savedPages[i][1]["last_refresh"];
      //console.log(getOptsEntry(savedPages[i]));
      //monitoredPages.append(getOptsEntry(savedPages[i]));
    }
  }
}
