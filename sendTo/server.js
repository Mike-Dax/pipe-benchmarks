const { ipcRenderer } = require("electron");

let clientWindowID = null;

ipcRenderer.once("client", (event, id) => {
  clientWindowID = id;
  console.log("received client id");
});

const num = 20000;

let start = new Date().getTime();

let received = 0;

let receivedTotalCount = 0;
let sentTotalCount = 0;

let waitingFor = -1;

function sendBatch() {
  start = new Date().getTime();
  for (let index = 0; index <= num; index++) {
    ipcRenderer.sendTo(
      clientWindowID,
      "ping",
      JSON.stringify({
        keyA: index,
        keyB: index * 1000
      })
    );
    sentTotalCount += index + index * 1000;
  }

  waitingFor = num;
}

ipcRenderer.on("pong", (e, rawData) => {
  const data = JSON.parse(rawData);

  receivedTotalCount += data.keyA + data.keyB;

  if (received === waitingFor) {
    console.log(
      `Finished ping-pong ${num} messages in ${new Date().getTime() -
        start}ms, ${(new Date().getTime() - start) / num}ms per message`,
      receivedTotalCount,
      sentTotalCount
    );
    received = 0;
    waitingFor = -1;
    sendBatch();
  }

  received++;
});

setTimeout(() => {
  if (!clientWindowID) {
    throw new Error("havent received ID yet");
  }
  sendBatch();
}, 1000);
