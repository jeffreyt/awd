


function pages2Str(pages){
    var outStr = "";
    for (var key in pages){
        outStr = outStr.concat(key + ',\t' + pages[key]["name"] + ',\t' + pages[key]["price"] + '\n');
    }
    return outStr;
}
