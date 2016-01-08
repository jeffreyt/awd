
window.onload = function(){
    document.getElementById("import_perform").addEventListener('click',function(){
        var importText = document.getElementById("text_area").value
        importPages(importText);
    });
    document.getElementById("export_perform").addEventListener('click',function(){
        document.getElementById("text_area").value = "";
        exportPages();
        //document.getElementById("export_perform").disabled = true;
    });

}
