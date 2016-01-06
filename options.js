
var SAVED_PAGES;


window.onload = function(){
    document.getElementById("import_perform").addEventListener('click',function(){
	var importText = document.getElementById("text_area").value
	importPages(importText);
    });

    document.getElementById("export_perform").addEventListener('click',function(){
	document.getElementById("text_area").value = "";

	exportPages();

	/*
	exportText=null;
	exportPages();
	setTimeout(function() {
	    if(exportText) console.log(exportText);
	}, 100);	  

	*/
	
	document.getElementById("export_perform").disabled = true;
	//document.getElementById("text_area").value = exportPages();
    });
    
}

