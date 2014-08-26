var data = require("sdk/self").data;
var cm = require("sdk/context-menu");
var pnl = require("sdk/panel");
var word;

var cntntPnl = pnl.Panel({
    contentURL: data.url("content.html"), 
});

var synFindItem = cm.Item({
  label: "Find Synonym",
  
  context: cm.PredicateContext( function predicateFunction(context) {
      var selText = context.selectionText;
      if (selText != null && selText != "" && !selText.match("^\w*\S*\w$")) {
    	  console.log("selection predicate true");
    	  return true;
      }
      return false;
  }),
  
  contentScript: 'self.on("click", function () {' +
                    'var selText = window.getSelection().toString(); ' +
                    'console.log("selText: " + selText); ' +
                    'self.postMessage(selText); ' +
                  '});',
                    
  onMessage: function(word) {
      word = word.charAt(0).toUpperCase() + word.substring(1,word.length).toLowerCase();
      console.log("send word: " + word);
      cntntPnl.show();
      cntntPnl.port.emit("getWord", word);
     }
});

