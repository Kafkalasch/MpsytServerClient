function httpGetAsync(theUrl, callback)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4)
            callback(xmlHttp.responseText);
    }
    xmlHttp.open("GET", theUrl, true); // true for asynchronous 
    xmlHttp.send(null);
}

/**
 * Get the current URL.
 *
 * @param {function(string)} callback - called when the URL of the current tab
 *   is found.
 */
function getCurrentTabUrl(callback) {
  // Query filter to be passed to chrome.tabs.query - see
  // https://developer.chrome.com/extensions/tabs#method-query
  var queryInfo = {
    active: true,
    currentWindow: true
  };

  chrome.tabs.query(queryInfo, function(tabs) {
    // chrome.tabs.query invokes the callback with a list of tabs that match the
    // query. When the popup is opened, there is certainly a window and at least
    // one tab, so we can safely assume that |tabs| is a non-empty array.
    // A window can only have one active tab at a time, so the array consists of
    // exactly one tab.
    var tab = tabs[0];

    // A tab is a plain object that provides information about the tab.
    // See https://developer.chrome.com/extensions/tabs#type-Tab
    var url = tab.url;

    // tab.url is only available if the "activeTab" permission is declared.
    // If you want to see the URL of other tabs (e.g. after removing active:true
    // from |queryInfo|), then the "tabs" permission is required to see their
    // "url" properties.
    console.assert(typeof url == 'string', 'tab.url should be a string');

    callback(url);
  });

  // Most methods of the Chrome extension APIs are asynchronous. This means that
  // you CANNOT do something like this:
  //
  // var url;
  // chrome.tabs.query(queryInfo, function(tabs) {
  //   url = tabs[0].url;
  // });
  // alert(url); // Shows "undefined", because chrome.tabs.query is async.
}



function renderStatus(statusText) {
  document.getElementById('status').textContent = statusText;
}

function play(modus) {
  console.info(modus);
  if(modus === 'single'){
    moduscommandappend='single=';
  }else if(modus === 'mix'){
    moduscommandappend='mix=';
  }else{
    requestUrl="http://10.0.0.8:5678/GoogleChromePlugin/?stop";
    renderStatus("stoppe...");
    httpGetAsync(requestUrl, renderStatus);
    console.info("stop request sent.")
    return;
  }
  

  getCurrentTabUrl(  function(url) {
    console.info(url + " gefunden.");
    if(url.indexOf("youtube.com") !== -1){
      renderStatus("Versuche " + url + " abzuspielen.");
      requestUrl="http://10.0.0.8:5678/GoogleChromePlugin/?"+moduscommandappend+url;
      httpGetAsync(requestUrl, renderStatus);
    }else{
      renderStatus("Funktioniert aktuell nur mit youtube...");
    }

    
  });

}

document.addEventListener('DOMContentLoaded', function() {
  //- Using and anonymous function:
  document.getElementById("button_single").onclick = function () { play('single'); };
  document.getElementById("button_mix").onclick = function () { play('mix'); };
  document.getElementById("button_stop").onclick = function () { play('stop'); };
});
