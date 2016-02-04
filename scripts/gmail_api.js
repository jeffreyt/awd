
/*
chrome.identity.getAuthToken({ 'interactive': true }, function(response){
  console.log(response);
});

chrome.identity.getProfileUserInfo(function(response){
	console.log(response);
});

function sendEmail(userId, email) {
  var base64EncodedEmail = btoa(email).replace(/\//g,'_').replace(/\+/g,'-');
	console.log(base64EncodedEmail);
  var request = gapi.client.gmail.users.messages.send({
    'userId': userId,
    'message': {
      'raw': base64EncodedEmail
    },
		callback:function(){
			console.log("gmail sent to self");
		}

  });

  request.execute(function(response){
		console.log(response);
	});

}

function testMail(){
	messageid = "<CAFqtp8p=4R2BLupN3EaV2Wi7-doioqX8ecCwGO7ni_iA_0Oh=A@mail.gmail.com>";
	gapi.client.request({
     path: "gmail/v1/users/me/messages/" + messageid + "/modify",
     method: "POST",
     body: "{\"addLabelIds\": [\"UNREAD\",\"INBOX\"]}",
     callback: function() {
         console.log("gmail sent to self");
         return console.log(arguments);
     }
	 });
}
/*
function modifyMessage(userId, messageId, labelsToAdd, labelsToRemove, callback) {
  var request = gapi.client.gmail.users.messages.modify({
    'userId': userId,
    'id': messageId,
    'addLabelIds': labelsToAdd,
    'removeLabelIds': labelsToRemove
  });
  request.execute();
}

function constructEmail(toName,frName,toAddr,frAddr,subject,body){
	returnStr = '';
	dateStr = '';
	returnStr = 'From: '+frName+' <'+frAddr+'>\nTo: '+toName+' <'+toAddr+'>\nSubject: '+subject+'\nDate: '+dateStr+'\n\n'+body;
	return returnStr;
}


/*
From: John Doe <jdoe@machine.example>
To: Mary Smith <mary@example.net>
Subject: Saying Hello
Date: Fri, 21 Nov 1997 09:55:06 -0600
Message-ID: <1234@local.machine.example>

This is a message just to say hello. So, "Hello".


*/



/*

getAuthTokenSilent();

function getAuthTokenSilent() {
    getAuthToken({
        'interactive': false,
        'callback': getAuthTokenSilentCallback,
    });
}

function getAuthTokenSilentCallback(token) {
    // Catch chrome error if user is not authorized.
    if (chrome.runtime.lastError) {
        showAuthNotification();
    } else {
    }
}

function showAuthNotification() {
    var options = {
        'id': 'start-auth',
        'iconUrl': 'imgs/icon.png',
        'title': 'GDE Sample: Chrome extension Google APIs',
        'message': 'Click here to authorize access to Gmail',
    };
    createBasicNotification(options);
}

function createBasicNotification(options) {
    var notificationOptions = {
        'type': 'basic',
        'iconUrl': options.iconUrl, // Relative to Chrome dir or remote URL must be whitelisted in manifest.
        'title': options.title,
        'message': options.message,
        'isClickable': true,
    };
    chrome.notifications.create(options.id, notificationOptions, function(notificationId) {});
}

function getAuthToken(options) {
    chrome.identity.getAuthToken({ 'interactive': options.interactive }, options.callback);
}

function notificationClicked(notificationId){
    // User clicked on notification to start auth flow.
    if (notificationId === 'start-auth') {
        getAuthTokenInteractive();
    }
}

function getAuthTokenInteractive() {
    getAuthToken({
        'interactive': true,
        'callback': getAuthTokenInteractiveCallback,
    });
}
function getAuthTokenInteractiveCallback(token) {
    // Catch chrome error if user is not authorized.
    if (chrome.runtime.lastError) {
        showAuthNotification();
    } else {
        getProfile(token);
    }
}


function getProfile(token) {
    get({
        'url': 'https://www.googleapis.com/plus/v1/people/me',
        'callback': getProfileCallback,
        'token': token,
    });
}

*/
