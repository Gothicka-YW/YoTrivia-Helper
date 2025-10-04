chrome.action.onClicked.addListener(async (tab)=>{
  try{ await chrome.sidePanel.open({windowId: tab.windowId}); }catch(e){}
});