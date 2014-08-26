var data = require("sdk/self").data;
var cm = require("sdk/context-menu");
var pnl = require("sdk/panel");
var word;

var cntntPnl = pnl.Panel({
    contentURL: data.url("content.html"), 
    contentScriptFile: [data.url("jquery-2.1.1.min.js"), data.url("scripts.js")]
});

var selContext = cm.SelectionContext();
var selContentScript = 'self.on("context", function () {' +
                    'var selText = window.getSelection().toString(); ' +
                    '   if (selText != null && selText != "" && !selText.match("^\w*\S*\w$")) { ' +
                    '       console.log("selText: " + selText); ' +
                    '       self.postMessage(selText); ' +
                    '   } ' +
                    '});';

var synFindItem = cm.Item({
  label: "Find Synonym",
  context: cm.PredicateContext( function predicateFunction(context) {
      var selText = context.selectionText;
      if (selText != null && selText != "" ){ //&& selText.match("^\w*\S*\w*$")){
            synFindItem.context.add(selContext);
            synFindItem.contentScript = selContentScript;
            return true;
      }
      return false;
  }),
  onMessage: function(word) {
      word = word.charAt(0).toUpperCase() + word.subString(1,word.length).toLowerCase();
      console.log("send word: " + word);
      self.port.emit("getWord", word);
      cntntPnl.show();
     } 
});

