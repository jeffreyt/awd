
window.onload = function(){

  //loading saved options
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

  document.getElementById("import_perform").addEventListener('click',function(){
      var importText = document.getElementById("text_area").value
      importPages(importText);
  });
  //export button
  document.getElementById("export_perform").addEventListener('click',function(){
      document.getElementById("text_area").value = "";
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
     })

  })
}
