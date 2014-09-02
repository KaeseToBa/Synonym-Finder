var data = require("sdk/self").data;
var cm = require("sdk/context-menu");
var pnl = require("sdk/panel");
var word;

var cntntPnl = pnl.Panel({
    width: 270,
    height: 180,
    contentURL: data.url("content.html")
});

var synFindItem = cm.Item({
  label: "Find Synonym",
  
  context: cm.PredicateContext( function predicateFunction(context) {
      var selText = context.selectionText;
      if (selText != null && selText != "" && !selText.match("^\w*\S*\w$")) {
    	  return true;
      }
      return false;
  }),
  
  contentScript: 'self.on("click", function (event) {' +
                    'var selText = window.getSelection().toString(); ' +
                    'self.postMessage(selText); ' +
                  '});',
                    
  onMessage: function(word) {
      word = word.charAt(0).toUpperCase() + word.substring(1,word.length).toLowerCase();
      cntntPnl.show();
      cntntPnl.port.emit("getWord", word);
     }
});

cntntPnl.port.on("resizePanel", function getHeight(height) {
    console.log("resizePanel" + height);
    if (height >= cntntPnl.height) {
        height = height > 500 ? 500 : height;
        cntntPnl.resize(270, height);
    }
    else {
        cntntPnl.resize(270, 180);
    }
});
