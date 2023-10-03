chrome.contextMenus.onClicked.addListener(genericOnClick);


let data = null

async function genericOnClick(info) {
  data = info
  chrome.windows.create({url:"popup.html", type:"popup", height:600, width:450});
}

chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
  if (msg.action == 'setData') {
    sendResponse(data);
  }
});


chrome.runtime.onInstalled.addListener(function () {
  let context = 'image';
  let title = "사진 업로드";
  chrome.contextMenus.create({
    title: title,
    contexts: [context],
    id: context
  });

});