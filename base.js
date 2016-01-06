
//constants
DIV_NAME = 'a-row a-spacing-mini olpOffer'
DIV_TRADE_NAME = ''
PRICE_NAME = 'a-size-large a-color-price olpOfferPrice a-text-bold'
CONDITION_NAME = 'a-size-medium olpCondition a-text-bold'
DESCRIPTION_NAME = 'comments'


//getOffers
//description:
//input: html (str)
//output: number of offers (int), offers (dictionary)

function getOffers(response){
    var el = document.createElement( 'html' );
    el.innerHTML = response;
    var offers = el.getElementsByClassName(DIV_NAME);
    if (offers.length > 0){
	var allOffers = []
	for (j=0;j<offers.length;j++){
	    var indArr = []
	    //console.log(offers[j]);
	    var price = offers[j].getElementsByClassName(PRICE_NAME)[0].innerText.trim();
	    var condition = offers[j].getElementsByClassName(CONDITION_NAME)[0].innerText.replace(/\r?\n|\r/g, '').trim().replace(/\s+/g, ' ');
	    var description = offers[j].getElementsByClassName(DESCRIPTION_NAME)[0].innerText.replace(/\r?\n|\r/g, '').trim().replace(/\s+/g, ' ');
	    if (description.indexOf('\u00AB') > -1) {description = description.substring(0,description.indexOf('\u00AB'));}
	    indArr.push(price);
	    indArr.push(condition);
	    indArr.push(description);

	    allOffers.push(indArr);
	}
    }
    return [offers.length, allOffers];
}

//getTradeIn
//description:
//input:
//output:

function getTradeIn(response){
    var el = document.createElement( 'html' );
    el.innerHTML = response;
    var tradeVal = el.getElementsByClassName(DIV_TRADE_NAME);
    
}

//importPages
//description:
//input:
//output:

function importPages(response){

    myResponse = "B00008O0YD,	.hack 2,	15.00\nB000094M46,	.hack 3,	20.00\nB000094M47,	.hack 4,	80.00";
    response = myResponse;
    response = response.split("\n");
    var savedPages = {};

    for (i=0;i<response.length;i++){
	itemStr = response[i];
	itemStr = itemStr.split(",");
	savedPages[itemStr[0].trim()] = {}
	savedPages[itemStr[0].trim()]["name"] = itemStr[1].trim();
	savedPages[itemStr[0].trim()]["price"] = parseFloat(itemStr[2]);
    }
    console.log(savedPages);

    chrome.storage.local.set({'saved_pages': savedPages}, function() {
        // Notify that we saved.
        console.log('saved');
    });
}

function exportPages(){
    
    var varName = 'saved_pages';
    chrome.storage.local.get(varName,function(result){

	
	pages2Str(result);

    });

    
}
