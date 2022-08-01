/*
  Copyright (c) Lightstreamer Srl
  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at
      http://www.apache.org/licenses/LICENSE-2.0
  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/

var stocksGrid= null;
var lsClient= null;
var fieldsList = ["key", "command", "destination", "departure", "terminal", "status", "airline"];
var fieldsListT = ["time"];

function main() {

    // Connect to Lightstreamer Server
    var protocolToUse= document.location.protocol != "file:" ? document.location.protocol : "http:";
    var portToUse= document.location.protocol == "https:" ? LS_HTTPS_PORT : LS_HTTP_PORT;

    lsClient= new Ls.LightstreamerClient(protocolToUse + "//" + LS_HOST + ":" + portToUse, "DEMO");

    lsClient.addListener(new Ls.StatusWidget("left", "0px", true));

    // Subscribe to Flights Monitor
    
    let dynaGrid = new Ls.DynaGrid("stocks",true);

    dynaGrid.setSort("key");
    dynaGrid.setNodeTypes(["div","span","img","a"]);
    dynaGrid.setAutoCleanBehavior(true, false);
    dynaGrid.addListener({
    onVisualUpdate: function(key,info) {
        if (info == null) {
        //cleaning
        return;
        }

        var cold = "#efefef";
        info.setAttribute("green", cold, "backgroundColor");
    }
    });

    dynaGrid.setSort("key");
    
    var subMonitor = new Ls.Subscription("COMMAND","DeltaDemo",fieldsList);
    subMonitor.addListener(dynaGrid);
    subMonitor.setRequestedSnapshot("yes");
    
    lsClient.subscribe(subMonitor);
    
    lsClient.connect();
    
    // Subscribe to Current Time
    let timeGrid = new Ls.DynaGrid("currtime",true);

    timeGrid.setNodeTypes(["div","span","img","a"]);
    timeGrid.setAutoCleanBehavior(true, false);
    timeGrid.addListener({
        onVisualUpdate: function(key,info) {
          if (info == null) {
            //cleaning
            return;
          }
          
          var cold = "#efefef";
          info.setAttribute("green", cold, "backgroundColor");
        }
      });
    
    let timeSubscription = new Ls.Subscription("MERGE","DeltaTime",fieldsListT);
    timeSubscription.addListener(timeGrid);
    timeSubscription.setDataAdapter("DATA");
    timeSubscription.setRequestedSnapshot("yes");
    
    lsClient.subscribe(timeSubscription);
}

main();