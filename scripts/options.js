
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
    //get options to save
    var intervalTime = parseFloat(document.getElementById("check_time").value);
    //createAlarm("time_alarm",intervalTime);
    //possible more variables here
    //save options

    chrome.storage.local.set({"interval_time":intervalTime},function(){
      console.log("Successfully saved");
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
  })
}

function refreshOptionsPage(){
  var bg = chrome.extension.getBackgroundPage();
  savedPages = bg.getSavedPages();
  var title = $('#monitored_pages_title');
  if(savedPages === undefined || Object.keys(savedPages).length < 1){
    title.append(getOptsTitle(false));
  }
  else {
    title.append(getOptsTitle(true));
    var monitoredPages = $('monitored_pages');
    for (i in savedPages){
      console.log(getOptsEntry(savedPages[i]));
    }
  }





}
