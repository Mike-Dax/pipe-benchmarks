const { ipcRenderer } = require("electron");
const Benchmark = require("benchmark");

// Setup Message Channels
const { port1: clientPort, port2: serverPort } = new MessageChannel();

ipcRenderer.postMessage("port", null, [serverPort]);

// Setup sendTo
let clientWindowID = null;

ipcRenderer.once("client", (event, id) => {
  clientWindowID = id;
  console.log("received client id");
});

// General setup

const NUM_TO_SEND = 10000;

function sendBatch(sendFunction) {
  for (let index = 0; index <= NUM_TO_SEND; index++) {
    sendFunction({
      keyA: index,
      keyB: index * 1000
    });
  }
}

// The benchmarks themselves

const suite = new Benchmark.Suite();

suite
  .add("sendTo", {
    defer: true,
    fn: function(deferred) {
      let received = 0;

      // Setup our reference for our done function
      let done;

      const handler = (e, rawData) => {
        const data = rawData;

        if (received === NUM_TO_SEND) {
          done();
        }
        received++;
      };

      // When we recieve messages back, run our handler
      ipcRenderer.on("pong", handler);

      // Setup our done function with the previous reference
      done = () => {
        ipcRenderer.removeListener("pong", handler);
        deferred.resolve();
      };

      // Setup our send function
      const sendFunc = d => {
        ipcRenderer.sendTo(clientWindowID, "ping", d);
      };

      // Send our batch of messages
      sendBatch(sendFunc);
    }
  })
  .add("MessageChannel", {
    defer: true,
    fn: function(deferred) {
      let received = 0;

      // Setup our reference for our done function
      let done;

      const handler = e => {
        const data = e.data;

        if (received === NUM_TO_SEND) {
          done();
        }
        received++;
      };

      // When we recieve messages back, run our handler
      clientPort.onmessage = handler;

      // Setup our done function with the previous reference
      done = () => {
        clientPort.onmessage = null;
        deferred.resolve();
      };

      // Setup our send function
      const sendFunc = d => {
        clientPort.postMessage(d);
      };

      // Send our batch of messages
      sendBatch(sendFunc);
    }
  })
  .on("cycle", function(event) {
    console.log(String(event.target));
  })
  .on("complete", function() {
    console.log(this[0].stats);

    console.log("Fastest is " + this.filter("fastest").map("name"));
  })
  .run();
